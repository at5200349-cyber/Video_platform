import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Video } from "../models/video.model";
import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";



const togglevideolike=asyncHandler(async(req,res)=>{
    const {VideoId}=req.params;
    const video=await Video.findById(VideoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    const likeby=req.user._id;


    const existlike=await Like.findOne({
        video:VideoId,
        likeby:likeby,
    })
    if(existlike){
        await Like.findByIdAndDelete(existlike._id);
        return res.status(201).json(new ApiResponse(201,{},"Dislike successfully"))
    }

   const createuser=await Like.create({
        video:VideoId,
        likeby:likeby
    })
    if(!createuser){
        throw new ApiError("500","Internal Server error");
    }


        return res.status(201).json(new ApiResponse(201,createuser,"Like successfully"));




})


export{togglevideolike};