import path from "path";
import fs from "fs";
import os from "os";

const GITHUB_URL_PATTERN =
  /^https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?(?:\/.*)?$/;

const GITHUB_API = "https://api.github.com";

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.trim().match(GITHUB_URL_PATTERN);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function fetchJson(url: string): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

async function downloadFile(
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  targetPath: string
): Promise<void> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  const headers: Record<string, string> = {};

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) return;

  const content = await res.text();
  const dir = path.dirname(targetPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(targetPath, content);
}

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "vendor",
  "storage",
  ".github",
  "tests",
  "database",
  "public",
  "resources",
  "bootstrap",
]);

const PHP_EXTENSIONS = new Set([".php"]);

export async function cloneRepository(
  githubUrl: string,
  targetDir: string
): Promise<string> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error(
      "Invalid GitHub URL. Use format: https://github.com/owner/repo"
    );
  }

  const { owner, repo } = parsed;
  const repoPath = path.join(targetDir, repo);
  fs.mkdirSync(repoPath, { recursive: true });

  try {
    const repoData = await fetchJson(`${GITHUB_API}/repos/${owner}/${repo}`);
    const defaultBranch = repoData.default_branch || "main";

    const treeData = await fetchJson(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
    );

    const files = treeData.tree.filter(
      (item: any) =>
        item.type === "blob" && shouldDownload(item.path)
    );

    const BATCH_SIZE = 10;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((file: any) =>
          downloadFile(owner, repo, defaultBranch, file.path, path.join(repoPath, file.path))
        )
      );
    }

    return repoPath;
  } catch (err) {
    try {
      fs.rmSync(repoPath, { recursive: true, force: true });
    } catch {}
    throw new Error(
      "Failed to fetch repository. Make sure it is a public GitHub repository."
    );
  }
}

function shouldDownload(filePath: string): boolean {
  const parts = filePath.split("/");
  for (const part of parts) {
    if (IGNORED_DIRS.has(part)) return false;
  }
  const ext = path.extname(filePath);
  if (PHP_EXTENSIONS.has(ext)) return true;
  if (filePath.endsWith("artisan")) return true;
  if (filePath === "composer.json") return true;
  return false;
}

export function cleanupTempDir(dirPath: string): void {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch {}
}

export function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "apidocai-"));
}
