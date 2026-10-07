import { Router } from "express";
import { getUserChannelSubcribers, toggleSubcription,getSubscribedChannels } from "../controllers/subscription.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();



router.use(verifyJWT);
router
.route("/c/:channelId")
.post(toggleSubcription)
.get(getUserChannelSubcribers);
router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;
