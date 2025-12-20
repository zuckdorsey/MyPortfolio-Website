import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const db = getDb();

        const result = await db.query('SELECT * FROM skills WHERE id = $1', [id]);

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
