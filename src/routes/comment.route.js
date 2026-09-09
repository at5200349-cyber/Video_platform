 import { Router} from "express";
 import { verifyJWT } from "../middlewares/auth.middleware";
import { addComment, getAllComment ,deleteComment, updateComment} from "../controllers/comment.controller";


 const router=Router();


 router.route("/:VideoId")
 .get(getAllComment)
 .post(verifyJWT,addComment)
 router.route("/:commentId")
 .delete(verifyJWT,deleteComment)
 .patch(verifyJWT,updateComment)
