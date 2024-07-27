import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js"
import { findTheVehicle, getBookedVehicle, loginUser, registerUser, upadteUserProfile } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { bookRide, getTravelHistoryBytheUser } from "./booking.router.js"

const router = Router()



router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    registerUser
)
router.route("/login").post(loginUser)
router.route("/booking").post(verifyJWT, bookRide)
router.route("/getTravelHistory").get(verifyJWT, getTravelHistoryBytheUser)
router.route("/updateUser").post(verifyJWT, upadteUserProfile)
router.route("/findTheVehicle").post(findTheVehicle)
router.route("/bookedVehicle").post(getBookedVehicle)


export default router