import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params?.id;
        const body = await readBody(event);
        const db = getDb();

        const {
            title, website, date, icon, badge_alt, description, skills
        } = body;

        const result = await db.query(
            `UPDATE certifications 
       SET title = $1, website = $2, date = $3, icon = $4, badge_alt = $5, description = $6, skills = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
            [title, website, date, icon, badge_alt, description, skills, id]
        );

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                message: 'Certification not found'
            });
        }

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
