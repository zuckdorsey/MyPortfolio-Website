import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env');
let envConfig: any = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }
        const idx = trimmedLine.indexOf('=');
        if (idx === -1) {
            return;
        }
        const key = trimmedLine.substring(0, idx).trim();
        const value = trimmedLine.substring(idx + 1).trim();
        if (key && value !== undefined) {
            envConfig[key] = value.replace(/^["']|["']$/g, '');
        }
    });
}

const DATABASE_URL = process.env.DATABASE_URL || envConfig.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || envConfig.NODE_ENV || 'development';

const poolConfig: any = {
    connectionString: DATABASE_URL,
};

if (NODE_ENV === 'production') {
    poolConfig.ssl = { rejectUnauthorized: true };
}

const pool = new Pool(poolConfig);

async function checkMigration() {
    const client = await pool.connect();
    try {
        const { rows: projects } = await client.query('SELECT name, image FROM projects WHERE image LIKE \'http%\'');
        console.log(`Found ${projects.length} projects with Cloudinary URLs:`);
        projects.forEach(p => console.log(`- ${p.name}: ${p.image}`));

        const { rows: pending } = await client.query('SELECT COUNT(*) as count FROM projects WHERE image NOT LIKE \'http%\' AND image IS NOT NULL AND image != \'\'');
        console.log(`Pending projects: ${pending[0].count}`);
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

checkMigration();
