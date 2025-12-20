import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = getDb();

        const {
            institution, website, degree, start_date, end_date, location, content_en, content_id
        } = body;

        const result = await db.query(
            `INSERT INTO education (institution, website, degree, start_date, end_date, location, content_en, content_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
            [institution, website, degree, start_date, end_date, location, content_en, content_id]
        );

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
