 import { Router} from "express";
 import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, getAllComment ,deleteComment, updateComment} from "../controllers/comment.controller.js";


 const router=Router();


 router.route("/:VideoId")
 .get(getAllComment)
 .post(verifyJWT,addComment)
 router.route("/c/:commentId")
 .delete(verifyJWT,deleteComment)
 .patch(verifyJWT,updateComment)


 export default router;