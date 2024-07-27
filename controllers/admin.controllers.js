
import { Admin } from "../models/admin.model.js";
import { bookingUser } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAcccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong");
    }
}



const verifyAdminEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        const verifyAdmin = await Admin.findOne({ email });

        if (!verifyAdmin) {
            console.log("error");
            return res.status(400).json({ message: "Admin not found" });
        }

        res.status(200).json(new ApiResponse(200, "Email Sent", verifyAdmin));

    } catch (error) {
        console.error("Error in verifyAdminEmail:", error);
        throw new ApiError(400, "Something went wrong");
    }
});

export default verifyAdminEmail;


const registerAdmin = asyncHandler(async (req, res) => {

    const { username, email, fullname, phoneNumber } = req.body;

    const avatarlocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    const avatar = await uploadOnCloudinary(avatarlocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user = await Admin.create({
        username: username.toLowerCase(),
        email,
        fullname,
        avatar: avatar.url,
        phoneNumber: phoneNumber,
        coverImage: coverImage?.url || ""
    })

    return res.status(201).json(
        new ApiResponse(200, user, "User is registered Successfully")
    );

})

const generateAcessTokenForAdminServer = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const admin = await Admin.findOne({ phoneNumber });


        console.log("accessToken for admin is called")

        if (!admin) {
            return res.status(404).json(new ApiResponse(404, null, "Admin not found"));
        }



        const { accessToken, refreshToken } = await generateAcccessAndRefreshToken(admin._id);



        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user: admin, accessToken, refreshToken },
                    "User logged in successfully"
                )
            );

    } catch (error) {
        console.error(error);
        throw new ApiError(400, "Something went wrong");
    }
});

const getEmployeeDetail = asyncHandler(async (req, res) => {

    try {

        const employee = await User.find()

        if (!employee)
            throw new ApiError(400, "cannot get the employee")

        return res.status(201).json(
            new ApiResponse(201, employee, "Employee details")
        )
    }
    catch (error) {
        throw new ApiError(400, "Something went wrong");
    }
})


const getTravleRecord = asyncHandler(async (req, res) => {


    try {
        const travelRecord = await bookingUser.find()

        if (!travelRecord)
            throw new ApiError(400, "travel recors not find")

        return res.status(201).json(
            new ApiResponse(201, travelRecord, "travelRecord details")
        )
    }
    catch (error) {
        throw new ApiError(400, "Something went wrong");
    }
})
export {
    verifyAdminEmail,
    registerAdmin,
    generateAcessTokenForAdminServer,
    getEmployeeDetail,
    getTravleRecord
}
