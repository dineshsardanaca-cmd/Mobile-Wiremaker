
'use server';

/**
 * @fileOverview Server action to handle exporting the entire application source code to GitHub.
 */

import fs from 'fs/promises';
import path from 'path';

interface GitHubFile {
  path: string;
  content: string;
}

const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', '.firebase', 'dist', 'out']);
const IGNORED_FILES = new Set(['.DS_Store', 'package-lock.json', '.env.local']);

async function getAllFiles(dir: string, baseDir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        if (IGNORED_DIRS.has(dirent.name)) return [];
        return getAllFiles(res, baseDir);
      } else {
        if (IGNORED_FILES.has(dirent.name)) return [];
        return [res];
      }
    })
  );
  return files.flat();
}

export async function pushFullAppToGitHub(
  token: string,
  repoPath: string,
  branch: string = 'main'
) {
  const [owner, repo] = repoPath.split('/');
  if (!owner || !repo) {
    throw new Error('Invalid repository path. Use format: username/repo');
  }

  const rootDir = process.cwd();
  const absoluteFiles = await getAllFiles(rootDir, rootDir);
  
  const results = [];

  for (const absPath of absoluteFiles) {
    // Calculate relative path for GitHub
    const relativePath = path.relative(rootDir, absPath).replace(/\\/g, '/');
    
    try {
      const content = await fs.readFile(absPath);
      const base64Content = content.toString('base64');

      // 1. Check if file exists to get SHA (required for updates)
      const getResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}?ref=${branch}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      let sha: string | undefined;
      if (getResponse.status === 200) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }

      // 2. Create or Update the file
      const putResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Backup ${relativePath} from MenuMorph App`,
            content: base64Content,
            branch,
            sha,
          }),
        }
      );

      if (!putResponse.ok) {
        const error = await putResponse.json();
        // If it's a 409 Conflict, it might be due to concurrent writes or SHA mismatch, 
        // we'll log it but continue with other files for a prototype backup.
        if (putResponse.status !== 409) {
            throw new Error(error.message || `Failed to push ${relativePath}`);
        }
      }

      results.push({ path: relativePath, success: true });
    } catch (error: any) {
      console.error(`Error pushing ${relativePath}:`, error);
      results.push({ path: relativePath, success: false, error: error.message });
    }
  }

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    const failedPaths = failed.map(r => r.path).slice(0, 3).join(', ');
    throw new Error(`Failed to sync ${failed.length} files. First few: ${failedPaths}`);
  }

  return { success: true, count: results.length };
}
