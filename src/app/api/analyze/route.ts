import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateProjectPath } from "@/security/validate";
import { analyzeLaravelProject } from "@/analyzer/laravel";
import { analyzeWithLLM } from "@/llm";
import { generateOpenAPI } from "@/openapi/generate";
import { generateMarkdown } from "@/markdown/generate";
import {
  parseGitHubUrl,
  cloneRepository,
  createTempDir,
  cleanupTempDir,
} from "@/security/github";
import type { EnrichedRoute } from "@/types/api";

const RequestSchema = z.object({
  source: z.string().min(1, "Source is required").max(500),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function isGitHubUrl(source: string): boolean {
  return /^https?:\/\/github\.com\//.test(source.trim());
}

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { source } = parsed.data;
    let projectPath: string;

    if (isGitHubUrl(source)) {
      const parsedUrl = parseGitHubUrl(source);
      if (!parsedUrl) {
        return NextResponse.json(
          { error: "Invalid GitHub URL. Use format: https://github.com/owner/repo" },
          { status: 400 }
        );
      }

      tempDir = createTempDir();
      try {
        projectPath = await cloneRepository(source, tempDir);
      } catch (err) {
        return NextResponse.json(
          {
            error:
              err instanceof Error
                ? err.message
                : "Failed to clone repository.",
          },
          { status: 400 }
        );
      }
    } else {
      projectPath = source;
    }

    const validation = validateProjectPath(projectPath);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const analysis = analyzeLaravelProject(projectPath);

    if (analysis.routes.length === 0) {
      return NextResponse.json(
        { error: "No API routes found in the project." },
        { status: 400 }
      );
    }

    const projectSummary = `Controllers: ${Object.keys(analysis.controllers).join(", ")}. Models: ${Object.keys(analysis.models).join(", ")}. Routes: ${analysis.routes.length} endpoints found.`;

    const analyzedApi = await analyzeWithLLM(
      analysis.routes as EnrichedRoute[],
      projectSummary
    );

    const openApiSpec = generateOpenAPI(analyzedApi);
    const markdown = generateMarkdown(analyzedApi);

    return NextResponse.json({
      openApi: openApiSpec,
      markdown,
      analyzedApi,
      routeCount: analysis.routes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while analyzing the project." },
      { status: 500 }
    );
  } finally {
    if (tempDir) {
      cleanupTempDir(tempDir);
    }
  }
}
