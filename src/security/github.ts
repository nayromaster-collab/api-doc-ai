import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const GITHUB_URL_PATTERN =
  /^https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?(?:\/.*)?$/;

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.trim().match(GITHUB_URL_PATTERN);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export function cloneRepository(
  githubUrl: string,
  targetDir: string
): string {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error(
      "Invalid GitHub URL. Use format: https://github.com/owner/repo"
    );
  }

  const cloneUrl = `https://github.com/${parsed.owner}/${parsed.repo}.git`;
  const repoPath = path.join(targetDir, parsed.repo);

  try {
    execSync(`git clone --depth 1 "${cloneUrl}" "${repoPath}"`, {
      timeout: 60_000,
      stdio: "pipe",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
  } catch {
    throw new Error(
      "Failed to clone repository. Make sure it is a public GitHub repository."
    );
  }

  return repoPath;
}

export function cleanupTempDir(dirPath: string): void {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch {
    // best effort cleanup
  }
}

export function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "apidocai-"));
}
