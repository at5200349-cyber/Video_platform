import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Subcription } from "../models/subcription.model";



const toggleSubcription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    const user=req.user._id;

    const channel=await User.findById(channelId);
    if(!channel){
        throw new ApiError(404,"Channel not found");
    }

    if(user.toString()===channelId.toString()){
        throw new ApiError(400,"You can not subcribe your self");
    }

    const subcribed=await Subcription.findOne({
        subscriber:user,
        channel:channelId,
    })
    if(subcribed){
        await Subcription.findByIdAndDelete(subcribed._id);
        return res.status(200).json(new ApiResponse(200,subcribed,"Unsubcribed successfully"));
    }

    const sub=await Subcription.create({
        subscriber:user,
        channel:channelId,
    })
    if(!sub){
        throw new ApiError(500,"Internal sever error");
    }
    return res.status(200).json(new ApiResponse(200,sub," subcribe successfully"));
})


const getUserChannelSubcribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    const page=Number(req.query.page)||1;
    const limit =20;
    const skip=(page-1)*limit;
    if(!channelId){
        throw(ApiError(404,"Channel not found"));
    }

    const subscribers=await Subcription.find({channel:channelId})
    .populate("subscriber","username fullname avatar")
    .skip(skip).
    limit(limit);
    return res.status(200).json(new ApiResponse(200,subscribers,"Subscribers fetched successfully"))

})

const getSubscribedChannels=asyncHandler(async(req,res)=>{

})
export{toggleSubcription,getUserChannelSubcribers,getSubscribedChannels};