import { describe, it, expect } from "vitest";
import {
  validateProjectPath,
  shouldIgnorePath,
  safeReadFile,
} from "../src/security/validate";
import path from "path";

const FIXTURE = path.resolve(__dirname, "../examples/laravel-api");

describe("Security module", () => {
  describe("validateProjectPath", () => {
    it("accepts valid Laravel project", () => {
      const result = validateProjectPath(FIXTURE);
      expect(result.valid).toBe(true);
    });

    it("rejects non-existent path", () => {
      const result = validateProjectPath("/nonexistent/path");
      expect(result.valid).toBe(false);
    });

    it("rejects non-Laravel directory", () => {
      const result = validateProjectPath(path.resolve(__dirname, ".."));
      expect(result.valid).toBe(false);
    });
  });

  describe("shouldIgnorePath", () => {
    it("ignores .git", () => {
      expect(shouldIgnorePath("/project/.git")).toBe(true);
    });

    it("ignores node_modules", () => {
      expect(shouldIgnorePath("/project/node_modules")).toBe(true);
    });

    it("ignores vendor", () => {
      expect(shouldIgnorePath("/project/vendor")).toBe(true);
    });

    it("ignores storage", () => {
      expect(shouldIgnorePath("/project/storage")).toBe(true);
    });

    it("ignores .env", () => {
      expect(shouldIgnorePath("/project/.env")).toBe(true);
    });

    it("ignores .env.local", () => {
      expect(shouldIgnorePath("/project/.env.local")).toBe(true);
    });

    it("ignores secrets directory", () => {
      expect(shouldIgnorePath("/project/secrets")).toBe(true);
    });

    it("ignores private key files", () => {
      expect(shouldIgnorePath("/project/private_key.pem")).toBe(true);
    });

    it("ignores credentials files", () => {
      expect(shouldIgnorePath("/project/credentials.json")).toBe(true);
    });

    it("allows regular source files", () => {
      expect(shouldIgnorePath("/project/app/Models/User.php")).toBe(false);
    });
  });

  describe("safeReadFile", () => {
    it("reads files within project root", () => {
      const content = safeReadFile(FIXTURE, "routes/api.php");
      expect(content).not.toBeNull();
      expect(content).toContain("Route");
    });

    it("rejects path traversal", () => {
      const content = safeReadFile(FIXTURE, "../../etc/passwd");
      expect(content).toBeNull();
    });

    it("rejects sensitive files", () => {
      const content = safeReadFile(FIXTURE, ".env");
      expect(content).toBeNull();
    });
  });
});
