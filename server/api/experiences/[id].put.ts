import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        const {
            company, company_url, position, start_date, end_date, type, technologies, content_en, content_id
        } = body;

        const result = await db.query(
            `UPDATE experiences 
       SET company = $1, company_url = $2, position = $3, start_date = $4, end_date = $5, type = $6, technologies = $7, content_en = $8, content_id = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
            [company, company_url, position, start_date, end_date, type, JSON.stringify(technologies), content_en, content_id, id]
        );

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Experience not found'
            });
        }

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
