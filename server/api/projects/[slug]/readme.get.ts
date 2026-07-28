import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getRouterParam, createError } from 'h3';

interface ProjectRecord {
  id: number;
  slug?: string;
  name: string;
  repo_link: string;
  [key: string]: unknown;
}

/**
 * Parse an "owner/repo" pair out of a GitHub URL.
 * Returns null for non-GitHub / closed-source entries.
 */
function parseGitHubRepo(repoLink: string): string | null {
  if (!repoLink || repo_linkIsClosed(repoLink)) return null;
  const m = repoLink.match(/github\.com\/([^/]+\/[^/?#]+)/i);
  if (!m) return null;
  return m[1].replace(/\.git$/, '').replace(/\/$/, '');
}

function repo_linkIsClosed(repoLink: string): boolean {
  return !repoLink || repoLink.startsWith('closed');
}

/**
 * GET /api/projects/:slug/readme
 * Fetches the project's README from GitHub at request time and returns it as
 * raw markdown. Cached at the Nitro layer. Returns:
 *   200 + { source: 'github', markdown }   on success
 *   404 + { source: 'none' }               closed-source or unknown project
 *   204 (extra) handled via 404 + source 'none' for empty readmes
 */
export default defineCachedEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing project slug' });
  }

  const filePath = resolve(process.cwd(), 'data/projects.json');
  const projects: ProjectRecord[] = JSON.parse(readFileSync(filePath, 'utf-8'));
  const project = projects.find((p) => p.slug === slug || String(p.id) === slug);

  if (!project) {
    throw createError({ statusCode: 404, message: 'Project not found', data: { source: 'none' } });
  }

  const repo = parseGitHubRepo(project.repo_link);
  if (!repo) {
    // Closed-source or non-GitHub — no readme available; caller falls back to local copy.
    throw createError({ statusCode: 404, message: 'No public repository for this project', data: { source: 'none' } });
  }

  const headers: Record<string, string> = {
    // Ask for the raw markdown body directly.
    Accept: 'application/vnd.github.raw+json',
    'User-Agent': 'portfolio-site',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  // `redirect: 'follow'` (the fetch default) transparently resolves GitHub's
  // 301 repo-rename redirects to the canonical repository id.
  const res = await fetch(`https://api.github.com/repos/${repo}/readme`, {
    headers,
    redirect: 'follow',
    // Let the platform cache this subrequest too when available.
    // @ts-ignore - cf is Cloudflare-specific, harmless elsewhere
    cf: { cacheTtl: 21600, cacheEverything: true },
  });

  if (!res.ok) {
    // Treat any GitHub failure as "no readme" so the page falls back to local content.
    throw createError({ statusCode: 404, message: `README unavailable (${res.status})`, data: { source: 'none' } });
  }

  const markdown = await res.text();
  if (!markdown || !markdown.trim()) {
    throw createError({ statusCode: 404, message: 'README is empty', data: { source: 'none' } });
  }

  return { source: 'github', repo, markdown };
}, {
  // Cache READMEs for 6 hours. Keys by slug automatically.
  maxAge: 60 * 60 * 6,
  name: 'project-readme',
  getKey: (event) => `project-readme:${getRouterParam(event, 'slug')}`,
});
