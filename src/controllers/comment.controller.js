import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Comment } from "../models/comment.model";
import { Video } from "../models/video.model";
import { Comment } from "../models/comment.model";

const getAllComment = asyncHandler(async (req, res) => {
  const { VideoId } = req.params;

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(VideoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        comment: 1,
        createdAt: 1,
        owner: {
          _id: 1,
          username: 1,
          fullname: 1,
          avatar: 1,
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});


// Addcomment function 
//we get videoId on which we commet
// we get comment from req.body
//check video exist or not
//than add a comment 
// return res


const addComment=asyncHandler(async(req,res)=>{
    const {VideoId}=req.params;
    const {comment}=req.body;
    if(!comment?.trim()){
        throw new ApiError(400,"Comment is required");
    }
    const checkvideo=await Video.findById(VideoId);
    if(!checkvideo){
         throw new ApiError(404, "Video not found");
    }
    const newComment=await Comment.create({
        comment:comment.trim(),
        owner:req.user._id,
        video:VideoId
    })
    return res.status(201).json(new ApiResponse(201,newComment,"Comment added successfully"))

});


// Deletecomment function


const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    

    const comment= await Comment.findById(commentId);
    if(!comment){
      throw new ApiError(404,"Comment not found");
    }
    const owner=comment.owner.toString();

    if(owner!==req.user._id.toString()){
      throw new ApiError(401,"Unautorized User");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Comment deleted successfully"));
  
});


// Update function 

const updateComment=asyncHandler(async(req,res)=>{
  const {commentId}=req.params;
  const {newComment}=req.body;
  const comment=await Comment.findById(commentId);
  if(!comment){
    throw new ApiError(404,"Comment not found by  this id");
  }
  if(comment.owner.toString()!==req.user._id.toString()){
    throw new ApiError(401,"Unautorized user");
  }

   const UpdatedComment=   await Comment.findByIdAndUpdate(commentId,{
    $set:{
     comment: newComment
    },
  },
    {
      new:true
    }
)

   


  return res.status(200).json(new ApiResponse(200,UpdatedComment,"Comment Updated Successfully"));

})





export {getAllComment,addComment,deleteComment,updateComment}
