import { Router } from "express";
const router=Router();
import { verifyJWT } from "../middlewares/auth.middleware";
import { togglecommentlike, togglevideolike,toggletweet, getLikedvideos } from "../controllers/like.controller";

router.route("/toggle/v/:videoId").post(verifyJWT,togglevideolike);
router.route("/toggle/c/commentId").post(verifyJWT,togglecommentlike);
router.route("/toggle/t/tweetId").post(verifyJWT,toggletweet);
router.route("/videos").get(verifyJWT,getLikedvideos)


export default router