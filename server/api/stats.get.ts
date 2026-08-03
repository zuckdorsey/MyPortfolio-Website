import projects from '~/data/projects.json';
import skills from '~/data/skills.json';
import experiences from '~/data/experiences.json';
import education from '~/data/education.json';
import certifications from '~/data/certifications.json';

export default defineEventHandler(() => ({
  projects: (projects as unknown[]).length,
  skills: (skills as unknown[]).length,
  experiences: (experiences as unknown[]).length,
  education: (education as unknown[]).length,
  certifications: (certifications as unknown[]).length,
}));