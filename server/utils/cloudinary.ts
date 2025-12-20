import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const config = useRuntimeConfig();

cloudinary.config({
    cloud_name: config.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: config.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
    api_secret: config.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string, folder: string = 'portfolio') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto',
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

export default cloudinary;
