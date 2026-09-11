import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Video } from "../models/video.model";
import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";
import {Tweet} from "../models/tweet.model";
import mongoose from "mongoose";



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

const togglecommentlike=asyncHandler(async(req,res)=>{
        const {commentId}=req.params
        const likeuser=req.user._id;
        const comment=await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(404,"Comment not found");
        }

        const existlike=await Like.findOne({
            comment:commentId,
            likeby:likeuser,
        });
        if(existlike){
            await Like.findByIdAndDelete(existlike._id);
            return res.status(201).json(new ApiResponse(201,{},"Like toggle Successfully"));
        }

     const likedcomment=   await Like.create({
            comment:commentId,
            likeby:likeuser
        })
        if(!likedcomment){
            throw new ApiError(500,"Internal server error");
        }
        return res.status(201).json(new ApiResponse(201,likedcomment,"Commment liked succssfully"));


})

const toggletweet= asyncHandler(async(req,res)=>{
    const {tweetId}=req.params;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    const tweetby=req.user._id;

    const existtweet=await Like.findOne({
        tweet:tweetId,
        likeby:tweetby
    });
    if(existtweet){
        await Like.findByIdAndDelete(existtweet?._id);
        throw new ApiResponse(201,{},"Like remved succefully");
    }
    const tweetcreate=await Like.create({
        tweet:tweetId,
        likeby:tweetby,

        
    })

    return res.status(201).json(new ApiResponse(201,tweetcreate,"Like succefully"));


})


const getLikedvideos=asyncHandler(async(req,res)=>{
        const userId=req.user._id;


        const likedVideos=await Like.aggregate([
            {
                $match:{
                    likeby:new mongoose.Types.ObjectId(userId),
                    video:{$exists:true}
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"video"
                }
            },{
                $unwind:"$video"
            },{
                $replaceRoot:{
                    newRoot:"$video"
                }
            }
        ]);

        return res.status(200).json(new ApiResponse(200,likedVideos,"Liked videos fetched successfully"))
})


export{togglevideolike,togglecommentlike,toggletweet,getLikedvideos};