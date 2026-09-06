import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getAllVideos } from "../controllers/video.controller.js";
import { uploadVideo } from "../controllers/video.controller.js";
import {upload} from "../middlewares/multer.middleware.js";




const router = Router();


router
.route("/")
.get(getAllVideos)
.post(verifyJWT,upload.fields([{name:"video",maxCount:1},{name:"thumbnail",maxCount:1}]),uploadVideo);



router
.route("/:videoId")
.get(getVideoById)
;








export default router;