import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        const {
            institution, website, degree, start_date, end_date, location, content_en, content_id
        } = body;

        const result = await db.query(
            `UPDATE education 
       SET institution = $1, website = $2, degree = $3, start_date = $4, end_date = $5, location = $6, content_en = $7, content_id = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
            [institution, website, degree, start_date, end_date, location, content_en, content_id, id]
        );

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Education not found'
            });
        }

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
