import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { asyncHandler } from "./asyncHandler";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCLOUDINARY = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded on Cloudinary:", response.url);

        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.log("Cloudinary upload error:", error);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};



const deleteOnCLOUDINARY= async(localpath)=>{
        try {
            if(!localpath)return null;
            const result =await cloudinary.uploader.destroy(localpath,{
                resource_type:auto

            });
            return result;
            
        } catch (error) {
            console.log("Cloudinary delete error",err);
            return null;
            
        }
};

export { uploadOnCLOUDINARY, deleteOnCLOUDINARY};