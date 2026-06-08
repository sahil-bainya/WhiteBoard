import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs"; // <-- file system provided by express, read ,write and perform other operations on files

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "WhiteBoard/Avatars",
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const getPublicId = (url) => {
  const parts = url.split("/");

  const uploadIndex = parts.indexOf("upload");

  const publicIdWithVersion = parts.slice(uploadIndex + 2).join("/");

  const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, "");

  return publicId;
};

const deleteFromCloudinary = async (url) => {
  try {
    const id = getPublicId(url);
    if (!id) return null;
    const response = await cloudinary.uploader.destroy(id, {
      resource_type: "auto",
    });
    console.log("file deleted from cloudinary");
    return response;
  } catch (error) {
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
