import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTweet, getUserTweet,updateTweet } from "../controllers/tweet.controller";

const router=Router();
router.route(verifyJWT);
router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweet);

export default router