import { Router } from "express";
import { getUserChannelSubcribers, toggleSubcription,getSubscribedChannels } from "../controllers/subscription.controller";

import { verifyJWT } from "../middlewares/auth.middleware";
const router=Router();



router.use("verifyJWT");
router
.route("/c/:channelId")
.post(toggleSubcription)
.get(getUserChannelSubcribers);
router.route("/u/:subscriberId").get(getSubscribedChannels);
