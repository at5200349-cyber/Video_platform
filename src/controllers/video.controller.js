import mongoose, { isValidObjectId, Schema } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCLOUDINARY } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "views",
    sortOrder = "desc",
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    isPublished: true,
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("owner", "-password -refreshToken -__v")
    .lean();
  const totalVideos = await Video.countDocuments(filter);

  if (!videos || videos.length === 0) {
    throw new ApiError(404, "No videos found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Videos fetched successfully", {
        videos,
        totalVideos,
        page: pageNumber,
        limit: limitNumber,
      })
    );
});

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;

    const videoFile = req.files.video[0].path;
    const thumbnailFile = req.files.thumbnail[0].path;
    if(!videoFile || !thumbnailFile){
        throw new ApiError(400,"Video and thumbnail files are required")
    }

    const videoUploadResult=await uploadOnCLOUDINARY(videoFile);
     if(!videoUploadResult){
        throw new ApiError(500,"Failed to upload video to Cloudinary")
    }
    const thumbnailUploadResult=await uploadOnCLOUDINARY(thumbnailFile);
    if(!thumbnailUploadResult){
        throw new ApiError(500,"Failed to upload thumbnail to Cloudinary")
    }

    const newVideo = await Video.create({
        videoFile: videoUploadResult.url,
        thumbnail: thumbnailUploadResult.url,
        title,
        description,
        duration,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video uploaded successfully"));

}
);

export { getAllVideos, uploadVideo };
