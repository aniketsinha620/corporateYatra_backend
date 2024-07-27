import { bookingUser } from "../models/booking.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const bookRide = asyncHandler(async (req, res) => {
    try {
        const { sendSource, sendDestination, vehicleID } = req.body
        console.log("booking ride is hit", { sendSource, sendDestination, vehicleID })
        const user_id = req.user._id

        const travelPath = await bookingUser.create({
            userID: user_id,
            sendSource: sendSource,
            sendDestination: sendDestination,
            vehicleID: vehicleID
        })

        const createdPath = await bookingUser.findById(travelPath._id)

        if (!createdPath)
            throw new ApiError(400, "Booking is not done")

        return res.status(201).json(
            new ApiResponse(200, createdPath, "successfully registered ")
        )
    }
    catch (error) {
        throw new ApiError(400, "Something went wrong")
    }

})


const getTravelHistoryBytheUser = asyncHandler(async (req, res) => {
    try {
        const user_id = req.user._id;
        console.log(user_id);
        const bookingData = await bookingUser.find({ userID: user_id });
        if (!bookingData) {
            throw new ApiError(400, "No booking history found")
        }
        return res.status(200).json(
            new ApiResponse(200, bookingData, "successfully executed")
        );
    } catch (error) {
        console.log('errrrr', error)
        throw new ApiError(400, "Something went wrong", error);
    }
});

export {
    bookRide,
    getTravelHistoryBytheUser
}