import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"


const adminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

        },
        fullname: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phoneNumber: {
            type: Number,
            required: false,
        },
        department: {
            type: String,
            required: false,
            lowercase: true,
            trim: true,
        },
        jobTitle: {
            type: String,
            required: false,
            lowercase: true,
            trim: true,
        },
        address: {
            type: String,
            required: false,
            lowercase: true,
            trim: true,
        },
        avatar: {
            type: String,
            required: true
        },

        coverImage: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            required: false

        },

        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
export const Admin = mongoose.model("Admin", adminSchema)