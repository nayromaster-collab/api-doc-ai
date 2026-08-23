import { describe, it, expect } from "vitest";
import path from "path";
import {
  extractRoutes,
  discoverControllers,
  discoverRequests,
  extractValidationRules,
  discoverResources,
} from "../src/analyzer/laravel";

const FIXTURE = path.resolve(__dirname, "../examples/laravel-api");

describe("Laravel analyzer", () => {
  describe("extractRoutes", () => {
    it("extracts routes from api.php", () => {
      const routes = extractRoutes(FIXTURE);
      expect(routes.length).toBeGreaterThan(0);
    });

    it("detects HTTP methods", () => {
      const routes = extractRoutes(FIXTURE);
      const methods = routes.map((r) => r.method);
      expect(methods).toContain("GET");
      expect(methods).toContain("POST");
      expect(methods).toContain("PUT");
      expect(methods).toContain("DELETE");
    });

    it("extracts route parameters", () => {
      const routes = extractRoutes(FIXTURE);
      const showRoute = routes.find(
        (r) => r.method === "GET" && r.uri.includes("{")
      );
      expect(showRoute).toBeDefined();
      expect(showRoute!.parameters.length).toBeGreaterThan(0);
    });
  });

  describe("discoverControllers", () => {
    it("finds controllers", () => {
      const controllers = discoverControllers(FIXTURE);
      expect(controllers.size).toBeGreaterThan(0);
    });

    it("finds ProductController", () => {
      const controllers = discoverControllers(FIXTURE);
      expect(controllers.has("ProductController")).toBe(true);
    });
  });

  describe("discoverRequests", () => {
    it("finds form requests", () => {
      const requests = discoverRequests(FIXTURE);
      expect(requests.size).toBeGreaterThan(0);
    });
  });

  describe("extractValidationRules", () => {
    it("parses validation rules from StoreProductRequest", () => {
      const requests = discoverRequests(FIXTURE);
      const storeRequest = requests.get("StoreProductRequest");
      expect(storeRequest).toBeDefined();

      const rules = extractValidationRules(storeRequest!.content);
      expect(rules).toHaveProperty("name");
      expect(rules).toHaveProperty("price");
      expect(rules["name"]).toContain("required");
    });
  });

  describe("discoverResources", () => {
    it("finds resource classes", () => {
      const resources = discoverResources(FIXTURE);
      expect(resources.size).toBeGreaterThan(0);
      expect(resources.has("ProductResource")).toBe(true);
    });
  });
});
