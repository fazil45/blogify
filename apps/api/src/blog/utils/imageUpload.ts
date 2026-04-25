import { ImageFormat } from "cloudinary";
import cloudinary from "./cloudinary.utils.js";
import { upload } from "./multer.utils.js"

export const uploadToCloudinary = (file:Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error("No result from cloudinary"));
        else resolve(result.secure_url);
      },
    );
    stream.end(file.buffer);
  });
};


export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  const splitUrl = imageUrl.split("/");
  const filename = splitUrl[splitUrl.length - 1];
  const folder = splitUrl[splitUrl.length - 2];
  const nameWithoutExt = filename?.split(".")[0];           
  const publicId = `${folder}/${nameWithoutExt}`;

  await cloudinary.uploader.destroy(publicId);
};
