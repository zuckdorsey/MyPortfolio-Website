import { v2 as cloudinary } from 'cloudinary';
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

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || envConfig.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY || envConfig.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET || envConfig.CLOUDINARY_API_SECRET;
const DATABASE_URL = process.env.DATABASE_URL || envConfig.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || envConfig.NODE_ENV || 'development';

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('Missing Cloudinary credentials');
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

const poolConfig: any = {
    connectionString: DATABASE_URL,
};

if (NODE_ENV === 'production') {
    poolConfig.ssl = { rejectUnauthorized: true };
}

const pool = new Pool(poolConfig);

async function migrateImages() {
    const client = await pool.connect();
    console.log('Starting migration...');

    try {
        // Migrate Projects
        const { rows: projects } = await client.query('SELECT * FROM projects');
        console.log(`Found ${projects.length} projects`);

        for (const project of projects) {
            // Check if image is already a URL
            if (project.image && !project.image.startsWith('http')) {
                // Construct path: public/projects/imageName.ext
                // If image doesn't have extension, try adding commonly used ones or use project.image_ext

                let imagePath = '';
                const baseName = project.image.replace(/^\//, ''); // remove leading slash if any

                // Try direct path in public/projects
                const potentialPath = path.resolve(process.cwd(), 'public', 'projects', baseName);
                if (fs.existsSync(potentialPath)) {
                    imagePath = potentialPath;
                } else if (project.image_ext) {
                    // Try with explicit extension
                    const pathWithExt = path.resolve(process.cwd(), 'public', 'projects', `${baseName}.${project.image_ext}`);
                    if (fs.existsSync(pathWithExt)) {
                        imagePath = pathWithExt;
                    }
                } else {
                    // Try common extensions
                    for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
                        const pathWithCommonExt = path.resolve(process.cwd(), 'public', 'projects', `${baseName}.${ext}`);
                        if (fs.existsSync(pathWithCommonExt)) {
                            imagePath = pathWithCommonExt;
                            break;
                        }
                    }
                }

                if (imagePath && fs.existsSync(imagePath)) {
                    console.log(`Uploading ${imagePath}...`);
                    try {
                        const result = await cloudinary.uploader.upload(imagePath, {
                            folder: 'portfolio/projects',
                            public_id: path.basename(project.image, path.extname(project.image))
                        });

                        // Update DB with Public ID (or secure_url if you prefer, but Public ID is better for management)
                        // Actually better to store full URL for simpler frontend usage, OR inconsistent usage?
                        // The user said "store in cloudinary", usually means using the Cloudinary URL.
                        // Let's store the secure_url.

                        await client.query('UPDATE projects SET image = $1 WHERE id = $2', [result.secure_url, project.id]);
                        console.log(`Updated project ${project.name}`);
                    } catch (err) {
                        console.error(`Failed to upload ${project.image}:`, err);
                    }
                } else {
                    console.warn(`File not found: ${imagePath}`);
                }
            }
        }

        // Migrate Certifications (if they implement images properly later, currently they have 'icon' which might be iconify or image)
        // Checking schema, certifications have 'icon' varchar(100). The form uses Iconify. So probably no images to migrate there yet.

        // Check Skills - they operate on Iconify icons too.

        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateImages();
