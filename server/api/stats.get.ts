import { readFileSync } from 'fs';
import { resolve } from 'path';

function readJsonCount(file: string): number {
  try {
    const data = JSON.parse(readFileSync(resolve('data', file), 'utf-8'));
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default defineEventHandler(() => ({
  projects: readJsonCount('projects.json'),
  skills: readJsonCount('skills.json'),
  experiences: readJsonCount('experiences.json'),
  education: readJsonCount('education.json'),
  certifications: readJsonCount('certifications.json'),
}));
