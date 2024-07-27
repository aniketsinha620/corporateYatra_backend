import { Router } from "express"
import { generateAcessTokenForAdminServer, getEmployeeDetail, getTravleRecord, registerAdmin, verifyAdminEmail } from "../controllers/admin.controllers.js"
import { upload } from "../middleware/multer.middleware.js"



const router = Router()


router.route("/registerAdmin").post(
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

    registerAdmin
)
router.route("/adminLogin").post(verifyAdminEmail)
router.route("/adminGetEmployeeDetails").get(getEmployeeDetail)
router.route("/adminGetTravelRecord").get(getTravleRecord)
router.route("/adminLogin/accessToken").post(generateAcessTokenForAdminServer)

export default router