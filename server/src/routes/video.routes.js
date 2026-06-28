import { Router } from "express"
import { processVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/process").post(verifyJWT, processVideo)

export default router