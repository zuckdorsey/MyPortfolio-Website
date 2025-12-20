import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Read .env manually since we are outside Nuxt
const envPath = path.resolve(process.cwd(), '.env');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/DATABASE_URL=(.*)/);
    if (match) {
        databaseUrl = match[1].trim();
        // Remove quotes if present
        if ((databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) || (databaseUrl.startsWith("'") && databaseUrl.endsWith("'"))) {
            databaseUrl = databaseUrl.slice(1, -1);
        }
    }
}

if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment or .env file');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

async function seed() {
    const client = await pool.connect();
    const contentDir = path.resolve(process.cwd(), 'content');

    try {
        console.log('Connected to database');

        // Clear existing data
        console.log('Truncating tables...');
        await client.query('TRUNCATE TABLE projects, skills, experiences, education, certifications RESTART IDENTITY CASCADE');

        // Seed Projects
        console.log('Seeding Projects...');
        const projectsDir = path.join(contentDir, 'projects');
        if (fs.existsSync(projectsDir)) {
            const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await client.query(
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
                } catch (e: any) {
                    console.error(`Error seeding project ${file}: ${e.message}`);
                }
            }
        }

        // Seed Skills
        console.log('Seeding Skills...');
        const skillsDir = path.join(contentDir, 'skills');
        if (fs.existsSync(skillsDir)) {
            const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await client.query(
                        `INSERT INTO skills (title, type, url, icon) 
             VALUES ($1, $2, $3, $4)`,
                        [data.title, data.type, data.url, data.icon]
                    );
                } catch (e: any) {
                    console.error(`Error seeding skill ${file}: ${e.message}`);
                }
            }
        }

        // Seed Experiences
        console.log('Seeding Experiences...');
        const experiencesDir = path.join(contentDir, 'experiences');
        if (fs.existsSync(experiencesDir)) {
            const files = fs.readdirSync(experiencesDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(experiencesDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await client.query(
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
                } catch (e: any) {
                    console.error(`Error seeding experience ${file}: ${e.message}`);
                }
            }
        }

        // Seed Education
        console.log('Seeding Education...');
        const educationDir = path.join(contentDir, 'education');
        if (fs.existsSync(educationDir)) {
            const files = fs.readdirSync(educationDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(educationDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await client.query(
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
                } catch (e: any) {
                    console.error(`Error seeding education ${file}: ${e.message}`);
                }
            }
        }

        // Seed Certifications
        console.log('Seeding Certifications...');
        const certificationsDir = path.join(contentDir, 'certifications');
        if (fs.existsSync(certificationsDir)) {
            const files = fs.readdirSync(certificationsDir).filter(f => f.endsWith('.md'));
            for (const file of files) {
                try {
                    const content = fs.readFileSync(path.join(certificationsDir, file), 'utf-8');
                    const parsed = matter(content);
                    const data = parsed.data;

                    await client.query(
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
                } catch (e: any) {
                    console.error(`Error seeding certification ${file}: ${e.message}`);
                }
            }
        }

        console.log('Seeding completed successfully');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
