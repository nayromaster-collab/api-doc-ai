import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import os from "os";
import { cloneRepository, createTempDir, cleanupTempDir } from "../src/security/github";
import { validateProjectPath } from "../src/security/validate";
import { extractRoutes } from "../src/analyzer/laravel";

describe("GitHub + Laravel integration", () => {
  it("downloads laravel/laravel and finds routes", async () => {
    const tempDir = createTempDir();
    try {
      const repoPath = await cloneRepository(
        "https://github.com/laravel/laravel",
        tempDir
      );

      // Verify it's detected as Laravel
      const validation = validateProjectPath(repoPath);
      expect(validation.valid).toBe(true);

      // Verify routes are found
      const routes = extractRoutes(repoPath);
      expect(routes.length).toBeGreaterThan(0);

      // Verify the route has expected properties
      expect(routes[0].method).toBe("GET");
      expect(routes[0].uri).toBe("/");
    } finally {
      cleanupTempDir(tempDir);
    }
  }, 30000);
});
