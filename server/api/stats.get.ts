import { getDb, handleDbError } from '../utils/db';

export default defineEventHandler(async (event) => {
    const db = getDb();
    try {
        const [
            projectsCount,
            skillsCount,
            experiencesCount,
            educationCount,
            certificationsCount
        ] = await Promise.all([
            db.query('SELECT COUNT(*) FROM projects'),
            db.query('SELECT COUNT(*) FROM skills'),
            db.query('SELECT COUNT(*) FROM experiences'),
            db.query('SELECT COUNT(*) FROM education'),
            db.query('SELECT COUNT(*) FROM certifications')
        ]);

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
