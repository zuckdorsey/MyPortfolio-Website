import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const db = getDb();

        const { title, type, url, icon } = body;

        const result = await db.query(
            `INSERT INTO skills (title, type, url, icon) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
            [title, type, url, icon]
        );

        return result.rows[0];
    } catch (error) {
        return handleDbError(error);
    }
});
