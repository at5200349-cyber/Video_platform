import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Like } from "../models/like.model";
import { Subcription } from "../models/subcription.model";



const getChannelStates=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"Invalid channel ID");
    }
    const channelObjectId=new mongoose.Types.ObjectId(channelId);
    const stats=await Video.aggregate([
        {
            $match:{
                owner:channelObjectId,
                isPublished:true
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }
        },{
           $group:{
             _id:null,
             totalVideos:{$sum:1},
             totalViews:{
                $sum:"$views"
             },
             totalLikes:{
                $sum:{$size:"$likes"}
             }
             
           } 
        }
    ])
    const totalSubscribers=await Subcription.countDocuments({
        channel:channelObjectId
    });
    const channelStats=stats[0]||{
        totalVideos:0,
        totalViews:0,
        totalLikes:0
    };
    
    channelStats.totalSubscribers=totalSubscribers;
    return res.status(200).json(
        new ApiResponse(200,channelStats,"Channel statistics fetched successfully")
    );
});
   


const getChannelVideo=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"Invalid channel Id");
    }
    const Uservideos=await Video.find({owner:channelId});
    return res.status(200).json(new ApiResponse(200,Uservideos,"Videos fetched successfully"));
})

    


export {getChannelStates,getChannelVideo};