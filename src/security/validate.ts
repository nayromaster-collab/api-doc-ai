import path from "path";
import fs from "fs";

const SENSITIVE_PATTERNS = [
  /\.env/i,
  /\.env\./i,
  /secrets/i,
  /private[_-]?key/i,
  /credentials/i,
  /\.pem$/i,
  /\.key$/i,
];

const IGNORED_DIRS = [".git", "node_modules", "vendor", "storage"];

const MAX_FILES = 500;
const MAX_DEPTH = 10;
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function validateProjectPath(
  projectPath: string
): { valid: true } | { valid: false; error: string } {
  const resolved = path.resolve(projectPath);

  if (!fs.existsSync(resolved)) {
    return { valid: false, error: "Path does not exist." };
  }

  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    return { valid: false, error: "Path is not a directory." };
  }

  const artisanPath = path.join(resolved, "artisan");
  if (!fs.existsSync(artisanPath)) {
    return {
      valid: false,
      error: "Not a Laravel project (artisan file not found).",
    };
  }

  return { valid: true };
}

export function shouldIgnorePath(filePath: string): boolean {
  const basename = path.basename(filePath);
  if (IGNORED_DIRS.includes(basename)) return true;
  if (SENSITIVE_PATTERNS.some((p) => p.test(basename))) return true;
  return false;
}

export function safeReadFile(
  projectRoot: string,
  relativePath: string
): string | null {
  const resolved = path.resolve(projectRoot, relativePath);
  const rootResolved = path.resolve(projectRoot);

  if (!resolved.startsWith(rootResolved)) return null;
  if (shouldIgnorePath(resolved)) return null;

  try {
    const stat = fs.statSync(resolved);
    if (stat.size > MAX_FILE_SIZE) return null;
    return fs.readFileSync(resolved, "utf-8");
  } catch {
    return null;
  }
}

export function collectFiles(
  projectRoot: string,
  dir: string = "",
  extensions: string[] = [".php"],
  depth: number = 0
): { filePath: string; relativePath: string; content: string }[] {
  const results: { filePath: string; relativePath: string; content: string }[] =
    [];

  if (depth > MAX_DEPTH) return results;
  if (results.length >= MAX_FILES) return results;

  const fullPath = path.join(projectRoot, dir);

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(fullPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (results.length >= MAX_FILES) break;

    const rel = dir ? `${dir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (!shouldIgnorePath(entry.name)) {
        results.push(
          ...collectFiles(projectRoot, rel, extensions, depth + 1)
        );
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.includes(ext)) {
        const content = safeReadFile(projectRoot, rel);
        if (content !== null) {
          results.push({
            filePath: path.join(projectRoot, rel),
            relativePath: rel,
            content,
          });
        }
      }
    }
  }

  return results;
}
