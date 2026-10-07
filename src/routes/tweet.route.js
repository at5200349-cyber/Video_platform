import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweet,updateTweet } from "../controllers/tweet.controller.js";

const router=Router();
router.route("/").post(verifyJWT,createTweet);
router.route("/user/:userId").get(verifyJWT,getUserTweet);
router.route("/:tweetId").patch(verifyJWT,updateTweet);

export default router