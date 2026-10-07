import { Router } from "express";
import { getChannelStates,getChannelVideo } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.use(verifyJWT);
router.route("/stats/:channelId").get(getChannelStates);
router.route("/videos/:channelId").get(getChannelVideo);
export default router;