import mongoose ,{ Schema}from "mongoose";

const playlistSchema=new Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true 
    },
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    
    


},{
    timestamps:true
})

export const Playlist=mongoose.model("Playlist",playlistSchema)