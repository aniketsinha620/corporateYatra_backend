import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

const port = process.env.DB_PORT || 8080;

dotenv.config({
    path: "/env"
})

connectDB()
    .then(() => {
        app.listen(process.env.DB_PORT, () => {
            console.log(`server is started at ${port}`)
        })
    })
    .catch((error) => {
        console.log("connection failed in index.js", error)
    })