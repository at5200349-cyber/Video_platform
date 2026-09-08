 import { Router} from "express";
 import { verifyJWT } from "../middlewares/auth.middleware";
import { getAllComment } from "../controllers/comment.controller";


 const router=Router();


 router.route("/:VideoId")
 .get(getAllComment)
 .post(verifyJWT,)
