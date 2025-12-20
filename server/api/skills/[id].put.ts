import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        const { title, type, url, icon } = body;

        const result = await db.query(
            `UPDATE skills 
       SET title = $1, type = $2, url = $3, icon = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
            [title, type, url, icon, id]
        );

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Skill not found'
            });
        }

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
