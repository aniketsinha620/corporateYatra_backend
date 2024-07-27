import { carDetail } from "../models/car.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addCar = asyncHandler(async (req, res) => {
    try {
        const { image, title, start_production, sendSource, sendDestination, carNumber, point } = req.body

        const createCarDetails = await carDetail.create({
            image: image,
            title: title,
            start_production: start_production,
            sendSource: sendSource,
            sendDestination: sendDestination,
            carNumber: carNumber,
            point: point
        })

        const createdCarDetail = await carDetail.findById(createCarDetails._id)

        if (!createdCarDetail)
            throw new ApiError(400, "unable register vehicle")

        return res.status(201).json(
            new ApiResponse(200, createdCarDetail, "Vehicle is registered Successfully")
        )
    }
    catch (error) {
        throw new ApiError(400, "unamle to add the vehicle")
        return res.status(500).json({ message: "Internal server error" });
    }
})

const getRegistedVehicleData = asyncHandler(async (req, res) => {

    try {
        const registedVehicleData = await carDetail.find()

        if (!registedVehicleData)
            throw new ApiError(400, "Something went Wrong")

        return res.status(201).json(
            new ApiResponse(200, registedVehicleData, "Successfull")
        );

    }
    catch (error) {
        throw new ApiError(400, "Can't get the Vehicle data")
        return res.status(500).json({ message: "Internal server error" });
    }
})

export {
    addCar,
    getRegistedVehicleData
}