import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        const {
            name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id
        } = body;

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
