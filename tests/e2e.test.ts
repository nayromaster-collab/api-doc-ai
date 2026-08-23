import { describe, it, expect } from "vitest";
import path from "path";
import { analyzeLaravelProject } from "../src/analyzer/laravel";
import { mockAnalyze } from "../src/llm/mock";
import { generateOpenAPI } from "../src/openapi/generate";
import { generateMarkdown } from "../src/markdown/generate";

const FIXTURE = path.resolve(__dirname, "../examples/laravel-api");

describe("End-to-end pipeline", () => {
  it("analyzes Laravel project and generates docs", () => {
    const analysis = analyzeLaravelProject(FIXTURE);
    expect(analysis.routes.length).toBeGreaterThan(0);

    const api = mockAnalyze(analysis.routes as any);
    expect(api.endpoints.length).toBeGreaterThan(0);

    const openApi = generateOpenAPI(api);
    expect(openApi.openapi).toBe("3.1.0");

    const markdown = generateMarkdown(api);
    expect(markdown.length).toBeGreaterThan(0);
    expect(markdown).toContain("#");
  });

  it("generates consistent OpenAPI and Markdown from same source", () => {
    const analysis = analyzeLaravelProject(FIXTURE);
    const api = mockAnalyze(analysis.routes as any);

    const openApi = generateOpenAPI(api);
    const markdown = generateMarkdown(api);

    const openApiPaths = Object.keys(
      openApi.paths as Record<string, unknown>
    );
    for (const p of openApiPaths) {
      expect(markdown).toContain(p);
    }
  });
});
