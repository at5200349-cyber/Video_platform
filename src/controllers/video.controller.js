import mongoose, { isValidObjectId, Schema } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCLOUDINARY ,deleteOnCLOUDINARY} from "../utils/cloudinary.js";

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

  return res.status(200).json(
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
  const thumbnail = req.files.thumbnail[0].path;
  if (!videoFile || !thumbnail) {
    throw new ApiError(400, "Video and thumbnail files are required");
  }

  const videoUploadResult = await uploadOnCLOUDINARY(videoFile);
  if (!videoUploadResult) {
    throw new ApiError(500, "Failed to upload video to Cloudinary");
  }
  const thumbnailUploadResult = await uploadOnCLOUDINARY(thumbnailFile);
  if (!thumbnailUploadResult) {
    throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
  }

  const newVideo = await Video.create({
         videoFile: {
            url: videoUploadResult.url,
            publicId: videoUploadResult.public_id
        },

        thumbnail: {
            url: thumbnailUploadResult.url,
            publicId: thumbnailUploadResult.public_id
        },
    title,
    description,
    duration,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
});




const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videos = await Video.find({ owner: videoId });

  return res
    .status(201)
    .json(new ApiResponse(201, videos, "videos fetch succefully"));
});



const updateVideo = asyncHandler(async (req, res) => {
    const {videoId}=req.params;
    const {title,description}=req.body;
    

  const video=await Video.findById(videoId);
  if(!video){
    throw new ApiError(404,"Video not found");
  }
    const ownerid=video.owner.toString();
    if(ownerid!= req.user._id.toString()){
      throw new ApiError(403,"You are not autorized for this");
    }
    
    if(title!==undefined){
      video.title=title
    }
    if(description!==undefined){
      video.description=description;
    }

    if(req.file){
    const  thumbnail=await uploadOnCLOUDINARY(req.file.path);
      if(!thumbnail){
        throw new ApiError(500,"Failed to upload thumbnail");
      }

      await deleteOnCLOUDINARY(video.thumbnail);
      video.thumbnail=thumbnail.url;

    }

    const updatedVide=await video.save();


    return res.status(200).json(new ApiResponse(200,updatedVide,"update successful"));


    
});

const deleteVideo=asyncHandler(async(req,res)=>{
      const {videoId}=req.params;
      const video=await Video.findById(videoId);
      if(!video){
        throw new ApiError(404,"video not found");
      }


      //Ownership Check

      const  owner=video.owner.toString();
      if(owner!==req.user._id.toString()){
        throw new ApiError(401,"You are not authorized to delete the video");
      };
      const deletedVideo=await deleteOnCLOUDINARY(video.videoFile.publicId,"video");
      if(!deletedVideo){
        throw new ApiError(500,"Failed to delete video from Cloudinary");

      }
      const deleteThubmnail=await deleteOnCLOUDINARY(video.thumbnail.publicId,"image");
      if(!deleteThubmnail){
                throw new ApiError(500,"Failed to delete video from Cloudinary");
      }


      await Video.findByIdAndDelete(videoId);
      return res.status(200).json(new ApiResponse(200,{},"Video delted ssuccessfully"));

})

const togglePublidhStatus=asyncHandler(async(req,res)=>{
  const{videoId}=req.params;
  const video=await Video.findById(videoId);
  if(!video){
    throw new ApiError(404,"video not found");
  }
  const owner=video.owner.toString();
  if(owner!==req.user._id.toString()){
    throw new ApiError (401,"You are not autorized for toggle");
  }
 

  video.isPublished=!video.isPublished;

await video.save();
return res.status(200).json(new ApiResponse(200,{},"status change successful"));

})

export { getAllVideos, uploadVideo, getVideoById, updateVideo,deleteVideo,togglePublidhStatus };
