
import mongoose, {model, Schema} from "mongoose";


const subcriptionSchema= new Schema({

    subscriber:{
        type: Schema.Types.ObjectId,  //One who is subcribing
        ref:"User"
    },
    chanel:{
        type: Schema.Types.ObjectId,  //One to whom 'subscriber' is subscribing
        ref:"User"
    }

},{
    timestamps:true
})



export const Subcription = mongoose.model("Subcription",subcriptionSchema)