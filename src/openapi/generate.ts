import type { AnalyzedApi } from "../types/api";

export function generateOpenAPI(api: AnalyzedApi): Record<string, unknown> {
  const securitySchemes: Record<string, unknown> = {};
  const hasAuth = api.endpoints.some(
    (e) => e.authentication && e.authentication.length > 0
  );
  if (hasAuth) {
    securitySchemes.bearerAuth = {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    };
  }

  const paths: Record<string, Record<string, unknown>> = {};

  for (const endpoint of api.endpoints) {
    if (!paths[endpoint.path]) {
      paths[endpoint.path] = {};
    }

    const operation: Record<string, unknown> = {
      summary: endpoint.summary,
      description: endpoint.description,
      operationId: endpoint.operationId,
      tags: endpoint.tags,
      responses: {},
    };

    if (endpoint.parameters && endpoint.parameters.length > 0) {
      operation.parameters = endpoint.parameters.map((p) => ({
        name: p.name,
        in: p.in,
        required: p.required,
        description: p.description,
        schema: p.schema || { type: "string" },
      }));
    }

    if (endpoint.requestBody) {
      operation.requestBody = {
        description: endpoint.requestBody.description,
        required: endpoint.requestBody.required,
        content: endpoint.requestBody.content || {
          "application/json": { schema: { type: "object" } },
        },
      };
    }

    if (endpoint.authentication && endpoint.authentication.length > 0) {
      operation.security = endpoint.authentication.map((auth) => ({
        [auth]: [],
      }));
    }

    if (endpoint.responses) {
      const responses = operation.responses as Record<string, unknown>;
      for (const resp of endpoint.responses) {
        const statusCode = String(resp.statusCode);
        responses[statusCode] = {
          description: resp.description,
          ...(resp.content ? { content: resp.content } : {}),
        };
      }
    }

    paths[endpoint.path][endpoint.method.toLowerCase()] = operation;
  }

  const spec: Record<string, unknown> = {
    openapi: "3.1.0",
    info: {
      title: api.info.title,
      description: api.info.description,
      version: api.info.version || "1.0.0",
    },
    paths,
  };

  if (api.servers && api.servers.length > 0) {
    spec.servers = api.servers;
  }

  if (Object.keys(securitySchemes).length > 0) {
    spec.components = { securitySchemes };
  }

  return spec;
}
