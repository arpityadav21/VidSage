import './config.js'
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/index.js"
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Server failed to start:", error)
    })

export { app }