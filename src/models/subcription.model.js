
import mongoose, { Schema} from "mongoose";


const subcriptionSchema= new Schema({

    subscriber:{
        type: Schema.Types.ObjectId,  //One who is subcribing
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId,  //One to whom 'subscriber' is subscribing
        ref:"User"
    }

},{
    timestamps:true
})
subcriptionSchema.index({
    subscriber:1,
    channel:1
},{
    unique:true
})


export const Subcription = mongoose.model("Subcription",subcriptionSchema)