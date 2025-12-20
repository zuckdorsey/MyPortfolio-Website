import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const db = getDb();

        const result = await db.query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Certification not found'
            });
        }

        return { message: 'Certification deleted successfully' };
    } catch (error) {
        return handleDbError(error);
    }
});
