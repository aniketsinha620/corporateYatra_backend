import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"



dotenv.config({
    path: "/env"
})

connectDB()
    .then(() => {
        app.listen(process.env.DB_PORT, () => {
            console.log(`server is started at ${process.env.DB_PORT}`)
        })
    })
    .catch((error) => {
        console.log("connection failed in index.js", error)
    })