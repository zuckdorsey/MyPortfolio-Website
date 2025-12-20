import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = getDb();

        const {
            title, website, date, icon, badge_alt, description, skills
        } = body;

        const result = await db.query(
            `INSERT INTO certifications (title, website, date, icon, badge_alt, description, skills) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [title, website, date, icon, badge_alt, description, skills]
        );

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
