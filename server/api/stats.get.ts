import { getDb, handleDbError } from '../utils/db';

export default defineEventHandler(async (event) => {
    const db = getDb();
    try {
        const projectsCount = await db.query('SELECT COUNT(*) FROM projects');
        const skillsCount = await db.query('SELECT COUNT(*) FROM skills');
        const experiencesCount = await db.query('SELECT COUNT(*) FROM experiences');
        const educationCount = await db.query('SELECT COUNT(*) FROM education');
        const certificationsCount = await db.query('SELECT COUNT(*) FROM certifications');

        return {
            projects: parseInt(projectsCount.rows[0].count),
            skills: parseInt(skillsCount.rows[0].count),
            experiences: parseInt(experiencesCount.rows[0].count),
            education: parseInt(educationCount.rows[0].count),
            certifications: parseInt(certificationsCount.rows[0].count),
        };
    } catch (error) {
        return handleDbError(error);
    }
});
