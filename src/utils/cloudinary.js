// it is a cloud (sdk )where we upload files
// we are following a production grade standard
// it get file from (file system) server and uplaod to cloud
const cloudinary = require('cloudinary').v2;
const fs = require("fs")

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  })



//  steps to do .
// get the local path of file and upload it on cloudinry

const uploadToCLoudinary = async(localeFilePath)=>{
       try {
        if(!localeFilePath) return null
        //   upload the file on cloudinary
           const response = await  cloudinary.uploader.upload(localeFilePath , {
                resource_type:"auto" // auto means it will detect the type of file(image , video etc)
            });
               // Delete local file after successful upload
                fs.unlinkSync(localeFilePath);
            //  file uploaded succesfully 
            console.log("fille upload successfully" , response);
            return response
            
       } catch (error) {
        console.log("file upload failed");
        fs.unlinkSync(localeFilePath) // it remove the locally saved temporary file if 
        //  the upload operation got failed
        return null
       }
}

// utility delete the post from cloudinary using public id
const deleteFromCloudinary = async(publicId)=>{
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result
    } catch (error) {
        console.log("cloudinary delete failed" , error.message)
    } 
}

// Utility to extract public_id from the image URL (on basic of public id delete the post)

const extractPublicId =async(url)=>{
    console.log("url" , url)

    if (!url || typeof url !== 'string') {
        throw new Error("URL is missing or not a string");
      }

        // image url ko / se split kr dena h means part bnane h
        const parts = url.split('/');
        console.log("parts" , parts);
        // extract last part
        const filename = parts[parts.length -1]  // image-name.jpg
        console.log("filename", filename)
        if (!filename) {
            throw new Error("Filename is undefined. Can't extract public_id.");
          }
        // extact public id from fileneme (image-name is public id);
        const publicId = filename.split('.')[0];  // Remove extension
        return publicId;

}




module.exports = {
         uploadToCLoudinary,
         extractPublicId,
         deleteFromCloudinary,
    }
 