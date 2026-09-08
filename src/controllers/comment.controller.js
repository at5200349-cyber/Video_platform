import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
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


const addComment=asyncHandler(async(req,res)=>{
    const {VideoId}=req.params;
    const {comment}=req.body;
    if(!comment?.trim()){
        throw new ApiError(400,"Comment is required");
    }
    const newComment=await Comment.create({
        comment:comment.trim(),
        owner:req.user._id,
        video:VideoId
    })
    return res.status(201).json(new ApiResponse(201,newComment,"Comment added successfully"))

});



export {getAllComment,addComment}
