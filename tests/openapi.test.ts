import { describe, it, expect } from "vitest";
import { generateOpenAPI } from "../src/openapi/generate";
import type { AnalyzedApi } from "../src/types/api";

const MOCK_API: AnalyzedApi = {
  info: { title: "Test API", description: "A test API", version: "1.0.0" },
  servers: [{ url: "http://localhost:8000", description: "Dev" }],
  endpoints: [
    {
      method: "GET",
      path: "/api/products",
      summary: "List products",
      description: "Get all products",
      operationId: "listProducts",
      authentication: [],
      parameters: [],
      requestBody: null,
      responses: [{ statusCode: 200, description: "Success" }],
      tags: ["Product"],
    },
    {
      method: "POST",
      path: "/api/products",
      summary: "Create product",
      description: "Create a new product",
      operationId: "createProduct",
      authentication: ["bearerAuth"],
      parameters: [],
      requestBody: {
        description: "Product data",
        required: true,
        content: {
          "application/json": {
            schema: { type: "object", properties: { name: { type: "string" } } },
            example: { name: "Widget" },
          },
        },
      },
      responses: [
        { statusCode: 201, description: "Created" },
        { statusCode: 422, description: "Validation error" },
      ],
      tags: ["Product"],
    },
  ],
};

describe("OpenAPI generator", () => {
  it("generates valid OpenAPI 3.1 structure", () => {
    const spec = generateOpenAPI(MOCK_API);
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.info).toHaveProperty("title");
    expect(spec.paths).toBeDefined();
  });

  it("maps endpoints to paths", () => {
    const spec = generateOpenAPI(MOCK_API);
    const paths = spec.paths as Record<string, Record<string, unknown>>;
    expect(paths["/api/products"]).toBeDefined();
    expect(paths["/api/products"].get).toBeDefined();
    expect(paths["/api/products"].post).toBeDefined();
  });

  it("includes parameters", () => {
    const apiWithParams: AnalyzedApi = {
      ...MOCK_API,
      endpoints: [
        {
          ...MOCK_API.endpoints[0],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Product ID",
              schema: { type: "string" },
            },
          ],
        },
      ],
    };
    const spec = generateOpenAPI(apiWithParams);
    const paths = spec.paths as Record<string, Record<string, any>>;
    expect(paths["/api/products"].get.parameters).toHaveLength(1);
  });

  it("includes request body", () => {
    const spec = generateOpenAPI(MOCK_API);
    const paths = spec.paths as Record<string, Record<string, any>>;
    expect(paths["/api/products"].post.requestBody).toBeDefined();
  });

  it("includes security schemes when auth is present", () => {
    const spec = generateOpenAPI(MOCK_API);
    expect(spec.components).toBeDefined();
    const components = spec.components as Record<string, Record<string, unknown>>;
    expect(components.securitySchemes).toHaveProperty("bearerAuth");
  });

  it("includes servers", () => {
    const spec = generateOpenAPI(MOCK_API);
    expect(spec.servers).toBeDefined();
    const servers = spec.servers as Array<{ url: string }>;
    expect(servers[0].url).toBe("http://localhost:8000");
  });
});
