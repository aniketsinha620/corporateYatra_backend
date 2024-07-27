import { Router } from "express"
import { addCar, getRegistedVehicleData } from "../controllers/car.controller.js"


const router = Router()

router.route("/addVehicle").post(addCar)
router.route("/getRegistedVehicle").get(getRegistedVehicleData)


export default router