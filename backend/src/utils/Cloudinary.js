import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config(); // Load env variables

// Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})



//file uploading function
const fileUpload = async (orginalFilePath) => {
  try {
    if (!orginalFilePath) return null;

    const response = await cloudinary.uploader.upload(orginalFilePath,{
        resource_type:"auto"
    });
    // console.log("your file was uploaded successfuly fileurl:", response);

    fs.unlinkSync(orginalFilePath);
    // console.log(orginalFilePath);
    return response;

  } catch (error) {

    console.log(error.message)
    fs.unlinkSync(orginalFilePath); //remove the temp file from the storage
    return null;
  }
};


export  {fileUpload};