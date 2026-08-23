import type { AnalyzedApi } from "../types/api";

export function generateMarkdown(api: AnalyzedApi): string {
  const lines: string[] = [];

  lines.push(`# ${api.info.title}`);
  lines.push("");
  if (api.info.description) {
    lines.push(api.info.description);
    lines.push("");
  }
  if (api.info.version) {
    lines.push(`**Version:** ${api.info.version}`);
    lines.push("");
  }

  if (api.servers && api.servers.length > 0) {
    lines.push("## Servers");
    lines.push("");
    for (const server of api.servers) {
      lines.push(`- **${server.description || "Server"}:** \`${server.url}\``);
    }
    lines.push("");
  }

  const endpointsByTag = new Map<string, typeof api.endpoints>();
  for (const endpoint of api.endpoints) {
    const tag = endpoint.tags?.[0] || "Other";
    if (!endpointsByTag.has(tag)) {
      endpointsByTag.set(tag, []);
    }
    endpointsByTag.get(tag)!.push(endpoint);
  }

  lines.push("## Endpoints");
  lines.push("");

  for (const [tag, endpoints] of endpointsByTag) {
    lines.push(`### ${tag}`);
    lines.push("");

    for (const ep of endpoints) {
      const methodBadge = `\`${ep.method}\``;
      lines.push(`#### ${methodBadge} ${ep.path}`);
      lines.push("");
      if (ep.summary) {
        lines.push(`**${ep.summary}**`);
        lines.push("");
      }
      if (ep.description) {
        lines.push(ep.description);
        lines.push("");
      }
      if (ep.operationId) {
        lines.push(`\`OperationId: ${ep.operationId}\``);
        lines.push("");
      }

      if (ep.authentication && ep.authentication.length > 0) {
        lines.push(`**Authentication:** ${ep.authentication.join(", ")}`);
        lines.push("");
      }

      if (ep.parameters && ep.parameters.length > 0) {
        lines.push("**Parameters:**");
        lines.push("");
        lines.push("| Name | In | Required | Description |");
        lines.push("|------|----|----------|-------------|");
        for (const p of ep.parameters) {
          lines.push(
            `| ${p.name} | ${p.in} | ${p.required ? "Yes" : "No"} | ${p.description || "-"} |`
          );
        }
        lines.push("");
      }

      if (ep.requestBody) {
        lines.push("**Request Body:**");
        lines.push("");
        if (ep.requestBody.description) {
          lines.push(ep.requestBody.description);
          lines.push("");
        }
        if (ep.requestBody.content) {
          for (const [mediaType, mediaObj] of Object.entries(
            ep.requestBody.content
          )) {
            lines.push(`Content-Type: \`${mediaType}\``);
            lines.push("");
            if (mediaObj.example) {
              lines.push("```json");
              lines.push(JSON.stringify(mediaObj.example, null, 2));
              lines.push("```");
              lines.push("");
            }
          }
        }
      }

      if (ep.responses && ep.responses.length > 0) {
        lines.push("**Responses:**");
        lines.push("");
        lines.push("| Status | Description |");
        lines.push("|--------|-------------|");
        for (const resp of ep.responses) {
          lines.push(`| ${resp.statusCode} | ${resp.description} |`);
        }
        lines.push("");
      }

      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}
