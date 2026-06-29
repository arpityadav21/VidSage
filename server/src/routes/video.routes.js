import { Router } from "express"
import { processVideo, getUserVideos, getVideoById, updateVideo, deleteVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/process").post(processVideo)
router.route("/").get(getUserVideos)
router.route("/:videoId").get(getVideoById)
router.route("/:videoId").patch(updateVideo)
router.route("/:videoId").delete(deleteVideo)

export default router