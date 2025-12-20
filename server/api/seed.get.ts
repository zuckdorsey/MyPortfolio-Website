import { getDb, handleDbError } from '../utils/db';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default defineEventHandler(async (event) => {
    const db = getDb();
    const contentDir = path.resolve(process.cwd(), 'content');
    const results = {
        projects: 0,
        skills: 0,
        experiences: 0,
        education: 0,
        certifications: 0,
        errors: [] as string[]
    };

    try {
        // Clear existing data
        await db.query('TRUNCATE TABLE projects, skills, experiences, education, certifications RESTART IDENTITY CASCADE');

        // Seed Projects
        const projectsDir = path.join(contentDir, 'projects');
        if (fs.existsSync(projectsDir)) {
            const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await db.query(
                        `INSERT INTO projects (name, link, repo_link, date, image, image_ext, technos, type, content_en, content_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [
                            data.name,
                            data.link || '',
                            data.repo_link || '',
                            data.date,
                            data.image,
                            data.imageExt,
                            JSON.stringify(data.technos || []),
                            JSON.stringify(data.type || []),
                            data.content?.en || '',
                            data.content?.id || ''
                        ]
                    );
                    results.projects++;
                } catch (e: any) {
                    results.errors.push(`Error seeding project ${file}: ${e.message}`);
                }
            }
        }

        // Seed Skills
        const skillsDir = path.join(contentDir, 'skills');
        if (fs.existsSync(skillsDir)) {
            const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await db.query(
                        `INSERT INTO skills (title, type, url, icon) 
             VALUES ($1, $2, $3, $4)`,
                        [data.title, data.type, data.url, data.icon]
                    );
                    results.skills++;
                } catch (e: any) {
                    results.errors.push(`Error seeding skill ${file}: ${e.message}`);
                }
            }
        }

        // Seed Experiences
        const experiencesDir = path.join(contentDir, 'experiences');
        if (fs.existsSync(experiencesDir)) {
            const files = fs.readdirSync(experiencesDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(experiencesDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await db.query(
                        `INSERT INTO experiences (company, company_url, position, start_date, end_date, type, technologies, content_en, content_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [
                            data.company,
                            data.companyUrl,
                            data.position,
                            data.period?.start,
                            data.period?.end,
                            data.type,
                            JSON.stringify(data.technologies || []),
                            data.content?.en || '',
                            data.content?.id || ''
                        ]
                    );
                    results.experiences++;
                } catch (e: any) {
                    results.errors.push(`Error seeding experience ${file}: ${e.message}`);
                }
            }
        }

        // Seed Education
        const educationDir = path.join(contentDir, 'education');
        if (fs.existsSync(educationDir)) {
            const files = fs.readdirSync(educationDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(educationDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await db.query(
                        `INSERT INTO education (institution, website, degree, start_date, end_date, location, content_en, content_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            data.institution,
                            data.website,
                            data.degree,
                            data.period?.start,
                            data.period?.end,
                            data.location,
                            data.content?.en || '',
                            data.content?.id || ''
                        ]
                    );
                    results.education++;
                } catch (e: any) {
                    results.errors.push(`Error seeding education ${file}: ${e.message}`);
                }
            }
        }

        // Seed Certifications
        const certificationsDir = path.join(contentDir, 'certifications');
        if (fs.existsSync(certificationsDir)) {
            const files = fs.readdirSync(certificationsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(certificationsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await db.query(
                        `INSERT INTO certifications (title, website, date, icon, badge_alt, description, skills) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [
                            data.title,
                            data.website,
                            data.date,
                            data.icon,
                            data.badgeAlt,
                            data.description,
                            data.skills
                        ]
                    );
                    results.certifications++;
                } catch (e: any) {
                    results.errors.push(`Error seeding certification ${file}: ${e.message}`);
                }
            }
        }

        return {
            message: 'Seeding completed',
            results
        };

    } catch (error) {
        return handleDbError(error);
    }
});
