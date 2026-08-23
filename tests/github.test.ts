import { describe, it, expect } from "vitest";
import { parseGitHubUrl } from "../src/security/github";

describe("GitHub URL parser", () => {
  it("parses valid HTTPS URL", () => {
    const result = parseGitHubUrl("https://github.com/laravel/framework");
    expect(result).toEqual({ owner: "laravel", repo: "framework" });
  });

  it("parses URL with .git suffix", () => {
    const result = parseGitHubUrl("https://github.com/user/repo.git");
    expect(result).toEqual({ owner: "user", repo: "repo" });
  });

  it("parses URL with trailing slash", () => {
    const result = parseGitHubUrl("https://github.com/user/repo/");
    expect(result).toEqual({ owner: "user", repo: "repo" });
  });

  it("parses HTTP URL", () => {
    const result = parseGitHubUrl("http://github.com/user/repo");
    expect(result).toEqual({ owner: "user", repo: "repo" });
  });

  it("rejects non-GitHub URL", () => {
    const result = parseGitHubUrl("https://gitlab.com/user/repo");
    expect(result).toBeNull();
  });

  it("rejects random string", () => {
    const result = parseGitHubUrl("not-a-url");
    expect(result).toBeNull();
  });

  it("rejects empty string", () => {
    const result = parseGitHubUrl("");
    expect(result).toBeNull();
  });

  it("handles URL with special chars in owner/repo", () => {
    const result = parseGitHubUrl("https://github.com/my-org/my-repo.name");
    expect(result).toEqual({ owner: "my-org", repo: "my-repo.name" });
  });
});
