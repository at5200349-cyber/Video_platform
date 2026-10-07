import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { mongoose } from "mongoose";
import { Playlist } from "../models/playlist.model.js";


const createplaylist = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const playlist = await Playlist.create({
    title: title,
    description: description,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(ApiResponse(200, playlist, "Playlist added successfully"));
});


const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invlid user Id");
  }
  const playlist = await Playlist.find({
    owner: userId,
  }).populate("videos");
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "User playlists fetched successfully")
    );
});


const addVideo = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added successfully"));
});


const removeVideo = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this playlist");
  }
  playlist.videos.pull(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed successfully"));
});


const deletePlaylistt = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(404, "Playlist not found");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist delete successfull"));
});


const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist not found");
  }
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not eleigible to edit it");
  }

  const updateplaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      title: name,
      description: description,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateplaylist, "Playlist updated successfully")
    );
});
const getPlylistById=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "This playlist is private");
}
    return res.status(200).json(new ApiResponse(200,playlist,"Playlist fetched successfully"));
})

export {
  createplaylist,
  addVideo,
  removeVideo,
  getUserPlaylist,
  updatePlaylist,
  deletePlaylistt,
  getPlylistById
};
