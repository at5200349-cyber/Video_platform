import redis from "../config/redis.config.js";
import { ApiError } from "../utils/Apiter=iError";
import { ApiResponse } from "../utils/ApiResponse";


const rateLimiter=(limit=100,windowSeconds=60)=>{
    return async(req,res,next)=>{
        try {
            const clientId=req.ip;
            const currentWindow=Math.floor(Date.now()/1000/windowSeconds);
            const key=`rate-limit:${clientId}:${currentWindow}`;
            const requests=await redis.incr(key);
            if(requests===1){
                await redis.expire(key,windowSeconds);
            }
            res.setHeader("X-RateLimit",limit);
            res.setHeader("X-RateLimit-Remaining",Math.max(0,limit-requests));
            if(requests>limit){
                return res.status(429).json(new ApiResponse(429,"Too many requests, please try again later"));
            }
            next();
            
        } catch (error) {
            next(error);
        }
    }
}

export default rateLimiter;