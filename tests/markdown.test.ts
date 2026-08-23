import { describe, it, expect } from "vitest";
import { generateMarkdown } from "../src/markdown/generate";
import type { AnalyzedApi } from "../src/types/api";

const MOCK_API: AnalyzedApi = {
  info: { title: "Products API", description: "API for managing products", version: "1.0.0" },
  servers: [{ url: "http://localhost:8000", description: "Local dev" }],
  endpoints: [
    {
      method: "GET",
      path: "/api/products",
      summary: "List products",
      description: "Retrieve all products",
      authentication: [],
      parameters: [],
      requestBody: null,
      responses: [
        { statusCode: 200, description: "Success" },
        { statusCode: 401, description: "Unauthorized" },
      ],
      tags: ["Product"],
    },
    {
      method: "POST",
      path: "/api/products",
      summary: "Create product",
      description: "Create a new product",
      authentication: ["bearerAuth"],
      parameters: [],
      requestBody: {
        description: "Product payload",
        required: true,
        content: {
          "application/json": {
            example: { name: "Widget", price: 9.99 },
          },
        },
      },
      responses: [{ statusCode: 201, description: "Created" }],
      tags: ["Product"],
    },
  ],
};

describe("Markdown generator", () => {
  it("generates markdown with title", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("# Products API");
  });

  it("includes version", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("1.0.0");
  });

  it("lists endpoints", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("GET");
    expect(md).toContain("/api/products");
    expect(md).toContain("POST");
  });

  it("includes method badges", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("`GET`");
    expect(md).toContain("`POST`");
  });

  it("includes parameters table", () => {
    const apiWithParams: AnalyzedApi = {
      ...MOCK_API,
      endpoints: [
        {
          ...MOCK_API.endpoints[0],
          parameters: [
            { name: "page", in: "query", required: false, description: "Page number" },
          ],
        },
      ],
    };
    const md = generateMarkdown(apiWithParams);
    expect(md).toContain("Parameters");
    expect(md).toContain("page");
  });

  it("includes request body examples", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("Request Body");
    expect(md).toContain("Widget");
  });

  it("includes response status codes", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("Responses");
    expect(md).toContain("200");
    expect(md).toContain("401");
  });

  it("includes authentication info", () => {
    const md = generateMarkdown(MOCK_API);
    expect(md).toContain("bearerAuth");
  });
});
