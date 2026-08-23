import { AnalyzedApiSchema, type AnalyzedApi, type EnrichedRoute } from "../types/api";

export async function openaiAnalyze(
  routes: EnrichedRoute[],
  projectSummary: string
): Promise<AnalyzedApi> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when using openai provider");
  }

  const routeDescriptions = routes
    .map(
      (r) =>
        `${r.method} ${r.uri} → ${r.controller}@${r.action}\n` +
        `  Middleware: ${r.middleware.join(", ") || "none"}\n` +
        `  Parameters: ${r.parameters.join(", ") || "none"}\n` +
        `  Validation: ${JSON.stringify(r.validation)}\n` +
        `  Auth: ${r.authRequired}`
    )
    .join("\n\n");

  const prompt = `You are an API documentation expert. Analyze these Laravel API routes and generate structured documentation.

Laravel project info:
${projectSummary}

Routes:
${routeDescriptions}

Return ONLY valid JSON matching this exact schema:
{
  "info": { "title": "string", "description": "string", "version": "string" },
  "servers": [{ "url": "string", "description": "string" }],
  "endpoints": [{
    "method": "string",
    "path": "string",
    "summary": "string",
    "description": "string",
    "operationId": "string",
    "authentication": ["string"],
    "parameters": [{ "name": "string", "in": "path|query", "required": boolean, "description": "string", "schema": { "type": "string" } }],
    "requestBody": null | { "description": "string", "required": boolean, "content": { "application/json": { "schema": {}, "example": {} } } },
    "responses": [{ "statusCode": number, "description": "string" }],
    "tags": ["string"]
  }]
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error("AI analysis service is temporarily unavailable");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI returned an invalid response. Please try again.");
  }

  const result = AnalyzedApiSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("AI response could not be processed. Please try again.");
  }

  return result.data;
}
