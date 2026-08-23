import type { AnalyzedApi, EnrichedRoute } from "../types/api";
import { mockAnalyze } from "./mock";
import { openaiAnalyze } from "./openai";

export async function analyzeWithLLM(
  routes: EnrichedRoute[],
  projectSummary: string
): Promise<AnalyzedApi> {
  const provider = process.env.LLM_PROVIDER || "mock";

  if (provider === "mock") {
    return mockAnalyze(routes);
  }

  if (provider === "openai") {
    return openaiAnalyze(routes, projectSummary);
  }

  throw new Error("Unknown LLM provider");
}
