import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema(
    {
        userID: {
            type: String,
            required: true,

        },
        sendSource: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        sendDestination: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        vehicleID: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        }

    },
    {
        timestamps: true
    }
)

export const bookingUser = mongoose.model("bookingUser", bookingSchema)