import  mongoose , {isValidObjectId}from "mongoose";
import {Tweet} from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet =asyncHandler(async(req,res)=>{
    const {content}=req.body;
    if(!content?.trim()){
        throw new ApiError(404,"Content not found");
    }
    const userId=req.user._id;
    const tweet=await Tweet.create({
        owner:userId,
        content:content.trim()
    })
    if(!tweet){
        throw new ApiError(500,"Tweet is not created");
    }
    return res.status.json(new ApiResponse(201,tweet,"Tweet created successfully"));
})

const getUserTweet=asyncHandler(async(req,res)=>{
    const {userId}=req.params;
    const tweet=await Tweet.find({
        owner:userId
    })
    
    return res.status(200).json(new ApiResponse(200,tweet,"Tweet fetch successfully"));
})

const updateTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params;
    const {content}=req.body;
    if(!content?.trim()){
        throw new ApiError(400,"Tweet content is required");
    }
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }

    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(401,"Unauthorized user");
    }

     const tweetupdated=await Tweet.findByIdAndUpdate(tweetId,{
            $set:{
                content:content.trim()
            }},
            {
                new:true
            }
     )

     return res.status(200).json(new ApiResponse(200,tweetupdated,"Tweet successfully updated"));

    

})

export {createTweet,getUserTweet,updateTweet}