import dotenv from "dotenv"
import connetDB from "./db/index.js";
import app from "./app.js"
dotenv.config({path:'./.env'})
import redis from "./db/redis.js";


dotenv.config();

const PORT=process.env.PORT||8000;
connetDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is runninng at port : ${PORT}`);
    })
})
.catch((e)=>{
    console.log("connection failed ",e);
})


















/*
import express from "express"
const app=express()
;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listining on port ${process.env.PORT}`);
       })
       console.log("connected successfully");
    } catch (error) {
        console.error("Error",error)
        throw err
    }
})()*/