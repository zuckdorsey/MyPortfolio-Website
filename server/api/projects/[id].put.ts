import { getDb, handleDbError } from '../../utils/db';
import { uploadImage, deleteImage } from '../../utils/cloudinary';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        let {
            name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id
        } = body;

        // Check if image is a base64 string
        if (image && image.startsWith('data:image')) {
            // Validate that it's a proper base64-encoded image
            const base64Pattern = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/;
            if (!base64Pattern.test(image)) {
                throw createError({ statusCode: 400, message: 'Invalid image format' });
            }
            
            try {
                // Fetch the old project data to delete the old image
                const oldProject = await db.query('SELECT image FROM projects WHERE id = $1', [id]);
                
                // Upload new image
                const uploadResult = await uploadImage(image, 'portfolio/projects');
                image = uploadResult.secure_url;
                
                // Delete old image from Cloudinary if it exists and is a Cloudinary URL
                if (oldProject.rows.length > 0 && oldProject.rows[0].image) {
                    const oldImageUrl = oldProject.rows[0].image;
                    if (oldImageUrl.includes('cloudinary.com')) {
                        // Extract public_id from Cloudinary URL
                        const urlParts = oldImageUrl.split('/');
                        const filename = urlParts[urlParts.length - 1];
                        const publicIdWithExt = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
                        const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
                        
                        try {
                            await deleteImage(publicId);
                        } catch (deleteErr) {
                            // Log but don't fail the update if deletion fails
                            console.error('Failed to delete old image:', deleteErr);
                        }
                    }
                }
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Failed to upload image:', err);
                } else {
                    console.error('Failed to upload image');
                }
                throw createError({ statusCode: 500, message: 'Image upload failed' });
            }
        }

        const result = await db.query(
            `UPDATE projects 
       SET name = $1, link = $2, repo_link = $3, date = $4, image = $5, image_ext = $6, technos = $7, type = $8, content_en = $9, content_id = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
            [name, link, repo_link, date, image, image_ext, JSON.stringify(technos), JSON.stringify(type), content_en, content_id, id]
        );

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Project not found'
            });
        }

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
