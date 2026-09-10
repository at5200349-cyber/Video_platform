import { Router } from "express";
const router=Router();
import { verifyJWT } from "../middlewares/auth.middleware";
import { togglevideolike } from "../controllers/like.controller";

router.route("/toggle/v/:videoId").post(verifyJWT,togglevideolike);


export default router