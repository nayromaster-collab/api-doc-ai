import { describe, it, expect } from "vitest";
import { mockAnalyze } from "../src/llm/mock";
import type { EnrichedRoute } from "../src/types/api";

const MOCK_ROUTES: EnrichedRoute[] = [
  {
    method: "GET",
    uri: "/api/products",
    controller: "ProductController",
    action: "index",
    middleware: [],
    parameters: [],
    validation: {},
    authRequired: false,
    controllerContent: null,
  },
  {
    method: "POST",
    uri: "/api/products",
    controller: "ProductController",
    action: "store",
    middleware: [],
    parameters: [],
    validation: { name: "required|string", price: "required|numeric" },
    authRequired: false,
    controllerContent: null,
  },
  {
    method: "GET",
    uri: "/api/products/{product}",
    controller: "ProductController",
    action: "show",
    middleware: [],
    parameters: ["product"],
    validation: {},
    authRequired: false,
    controllerContent: null,
  },
];

describe("Mock LLM provider", () => {
  it("returns valid AnalyzedApi structure", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    expect(result).toHaveProperty("info");
    expect(result).toHaveProperty("endpoints");
    expect(Array.isArray(result.endpoints)).toBe(true);
  });

  it("creates an endpoint for each route", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    expect(result.endpoints.length).toBe(MOCK_ROUTES.length);
  });

  it("preserves method and path", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    expect(result.endpoints[0].method).toBe("GET");
    expect(result.endpoints[0].path).toBe("/api/products");
  });

  it("generates summaries from action names", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    expect(result.endpoints[0].summary).toContain("List");
    expect(result.endpoints[1].summary).toContain("Create");
    expect(result.endpoints[2].summary).toContain("Get");
  });

  it("adds parameters from route", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    const showEndpoint = result.endpoints[2];
    expect(showEndpoint.parameters).toHaveLength(1);
    expect(showEndpoint.parameters[0].name).toBe("product");
  });

  it("adds request body for POST routes", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    const postEndpoint = result.endpoints[1];
    expect(postEndpoint.requestBody).not.toBeNull();
  });

  it("generates responses", () => {
    const result = mockAnalyze(MOCK_ROUTES);
    for (const ep of result.endpoints) {
      expect(ep.responses).toBeDefined();
      expect(ep.responses!.length).toBeGreaterThan(0);
    }
  });
});
