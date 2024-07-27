import { bookingUser } from "../models/booking.model.js";
import { carDetail } from "../models/car.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAcccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "something went wrong")
    }
}




const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password, phoneNumber, department } = req.body;
    console.log("Register route is hit")
    if ([username, email, fullname, password, phoneNumber, department].some(field => field?.trim() === "")) {
        throw new ApiError(400, "ALL fields are required");
    }



    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(400, "User already existed")
    }

    const avatarlocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarlocalPath)
        throw new ApiError(400, "avatar is required")

    const avatar = await uploadOnCloudinary(avatarlocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        phoneNumber,
        department,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(400, "somthing went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User is registered Successfully")
    );


})

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body
    console.log("login route is hit", { email, username, password })

    if (!email && !username)
        throw new ApiError(400, "Username and email are required")


    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user)
        throw new ApiError(400, "User does not ")

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect)
        throw new ApiError(400, 'Incorrect Password')


    const { accessToken, refreshToken } = await generateAcccessAndRefreshToken(user._id)
    //   console.log({ accessToken, refreshToken })
    const LoggedUser = await User.findById(user._id).select(
        "-password"
    )

    console.log(LoggedUser)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: LoggedUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})


const upadteUserProfile = asyncHandler(async (req, res) => {
    try {
        const { department, address, jobTitle, phoneNumber } = req.body
        console.log("userUpdate is hit")

        if (!department || !address || !jobTitle)
            throw new ApiError(400, "All field are required")

        const userId = req.user._id;
        const user = await User.findById(userId)
            .select("-password -refreshToken")

        if (!user)
            return res.status(404).json({ message: "User not found" });

        // console.log(user)
        user.department = department
        user.address = address
        user.jobTitle = jobTitle
        user.phoneNumber = phoneNumber

        await user.save({ validateBeforeSave: false })

        const savedUSer = await User.findById(user._id)
            .select("-password -refreshToken")

        if (!savedUSer) {
            throw new ApiError(400, "somthing went wrong")
        }
        console.log(savedUSer)

        return res.status(201).json(
            new ApiResponse(200, savedUSer, "User is registered Successfully")
        );
    }
    catch (error) {
        console.log(error)
    }
})

const findTheVehicle = asyncHandler(async (req, res) => {
    try {
        const { sendSource, sendDestination } = req.body;
        console.log({ sendSource, sendDestination })
        console.log({ sendSource, sendDestination })
        const selectedVehicle = await carDetail.find({
            sendSource: sendSource,
            sendDestination: sendDestination
        });

        if (!selectedVehicle.length) // check if array is empty
            throw new ApiError(400, "No vehicle found matching the criteria");

        return res.status(200).json({
            success: true,
            data: selectedVehicle,
            message: "Vehicles found successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        });
    }
});



const getBookedVehicle = asyncHandler(async (req, res) => {
    try {
        const { vehicleID } = req.body

        const bookedVehicle = await carDetail.findById(vehicleID)

        if (!bookedVehicle)
            throw new ApiError(400, "something went wrong")



        return res.status(201).json(
            new ApiResponse(200, bookedVehicle, "the booked data")
        );
    }
    catch (error) {
        console.log(error)
    }
})



export {
    registerUser,
    loginUser,
    upadteUserProfile,
    findTheVehicle,
    getBookedVehicle,


}