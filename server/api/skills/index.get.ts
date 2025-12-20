import { getDb, handleDbError } from '../../utils/db';

export default defineEventHandler(async (event) => {
    try {
        const db = getDb();
        const result = await db.query('SELECT * FROM skills ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        return handleDbError(error);
    }
});
