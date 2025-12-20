import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = getDb();

        const {
            name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id
        } = body;

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
