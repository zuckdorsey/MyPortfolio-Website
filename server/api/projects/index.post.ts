import { getDb, handleDbError } from '../../utils/db';
import { uploadImage } from '../../utils/cloudinary';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = getDb();

        let {
            name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id
        } = body;

        // Check if image is a base64 string or binary data that needs uploading
        if (image && image.startsWith('data:image')) {
            try {
                const uploadResult = await uploadImage(image, 'portfolio/projects');
                image = uploadResult.secure_url;
                // We typically don't need image_ext for cloudinary URLs, but keeping it for compatibility if needed.
                // Or we can leave it as is or set it to 'webp' or whatever cloudinary returns format-wise.
            } catch (err) {
                console.error('Failed to upload image:', err);
                // Fallback or throw? Let's throw for now as image upload failure is critical if intended.
                throw createError({ statusCode: 500, message: 'Image upload failed' });
            }
        }

        const result = await db.query(
            `INSERT INTO projects (name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
            [name, link, repo_link, date, image, image_ext, JSON.stringify(technos), JSON.stringify(type), content_en, content_id]
        );

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
