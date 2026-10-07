import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { addVideo,getUserPlaylist,deletePlaylistt,removeVideo,updatePlaylist,getPlylistById } from "../controllers/playlist.controller.js";


const router=Router();
router.use(verifyJWT);

router.route("/:playlistId")
.get(getPlylistById)
.patch(updatePlaylist)
.delete(deletePlaylistt)

router.route("/add/:videoId/:playlistId").patch(addVideo);
router.route("/remove/:videoId/:playlistId").patch(removeVideo);
router.route("/user/:userId").get(getUserPlaylist);

export default router;