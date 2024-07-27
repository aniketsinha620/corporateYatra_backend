import mongoose, { Schema } from "mongoose"


const carSchema = new Schema({

    image: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
    point: {
        type: String,
        required: true,
    },

    start_production: {
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
    driverName: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
    },
    carNumber: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    companyName: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
    }
}, {
    timestamps: true
}
)

export const carDetail = mongoose.model("carDetail", carSchema)
