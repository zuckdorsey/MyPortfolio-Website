import { Pool } from 'pg';
import { createError } from 'h3';

// Create a PostgreSQL connection pool for NeonDB
let pool: Pool;

export function getDb() {
  if (!pool) {
    // Get configuration from environment variables
    const config = useRuntimeConfig();
    const connectionString = config.databaseUrl;

    // Check if connection string is available
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined. Please set it in your .env file or environment variables.');
    }

    // Create connection pool
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for NeonDB
      }
    });
  }

  return pool;
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  const db = getDb();

  try {
    // Create categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        platform VARCHAR(100),
        author VARCHAR(100),
        url TEXT,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create topics table (learning items within courses or standalone)
    await db.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'not_done', -- not_done, in_progress, done
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        link VARCHAR(255),
        repo_link VARCHAR(255),
        date VARCHAR(50),
        image VARCHAR(255),
        image_ext VARCHAR(10),
        technos JSONB,
        type JSONB,
        content_en TEXT,
        content_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create skills table
    await db.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        url VARCHAR(255),
        icon VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create experiences table
    await db.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        company_url VARCHAR(255),
        position VARCHAR(255),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        type VARCHAR(50),
        technologies JSONB,
        content_en TEXT,
        content_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create education table
    await db.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        degree VARCHAR(255),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        location VARCHAR(100),
        content_en TEXT,
        content_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create certifications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        date VARCHAR(50),
        icon VARCHAR(100),
        badge_alt VARCHAR(255),
        description TEXT,
        skills TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper to handle database errors
export function handleDbError(error: any) {
  console.error('Database error:', error);
  return createError({
    statusCode: 500,
    message: 'Database error occurred',
    stack: ''
  });
}
