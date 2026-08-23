"use client";

import { useState } from "react";
import Link from "next/link";

interface AnalysisResult {
  openApi: Record<string, unknown>;
  markdown: string;
  analyzedApi: {
    info: { title: string; description?: string; version?: string };
    endpoints: Array<{
      method: string;
      path: string;
      summary?: string;
      description?: string;
      parameters?: Array<{
        name: string;
        in: string;
        required?: boolean;
        description?: string;
      }>;
      requestBody?: {
        description?: string;
        content?: Record<string, { schema?: unknown; example?: unknown }>;
      } | null;
      responses?: Array<{
        statusCode: number;
        description: string;
      }>;
      authentication?: string[];
    }>;
  };
  routeCount: number;
}

type Tab = "overview" | "endpoints" | "openapi" | "markdown";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-yellow-100 text-yellow-800",
  PATCH: "bg-orange-100 text-orange-800",
  DELETE: "bg-red-100 text-red-800",
};

export default function Home() {
  const [projectPath, setProjectPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!projectPath.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectPath: projectPath.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setActiveTab("overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              API Doc AI
            </Link>
            <p className="text-sm text-gray-500">
              AI-powered API documentation generator for Laravel projects
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Laravel Project Path
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              placeholder="/path/to/your/laravel-project"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !projectPath.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Analyzing Laravel project...</p>
          </div>
        )}

        {result && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 border-b border-gray-200">
                {(["overview", "endpoints", "openapi", "markdown"] as Tab[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                        activeTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    downloadFile(
                      JSON.stringify(result.openApi, null, 2),
                      "openapi.json",
                      "application/json"
                    )
                  }
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  Download OpenAPI JSON
                </button>
                <button
                  onClick={() =>
                    downloadFile(result.markdown, "api-docs.md", "text/markdown")
                  }
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  Download Markdown
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(result.openApi, null, 2)
                    )
                  }
                  className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  Copy OpenAPI JSON
                </button>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {result.analyzedApi.info.title}
                </h2>
                {result.analyzedApi.info.description && (
                  <p className="text-gray-600 mb-4">
                    {result.analyzedApi.info.description}
                  </p>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.routeCount}
                    </div>
                    <div className="text-sm text-gray-500">Endpoints</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(result.analyzedApi.endpoints.map((e) => e.path.split("/")[2])).size}
                    </div>
                    <div className="text-sm text-gray-500">Resources</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.analyzedApi.info.version || "1.0.0"}
                    </div>
                    <div className="text-sm text-gray-500">Version</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "endpoints" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 p-4 max-h-[600px] overflow-y-auto">
                  {result.analyzedApi.endpoints.map((ep, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEndpoint(i)}
                      className={`w-full text-left p-3 rounded-md mb-2 text-sm ${
                        selectedEndpoint === i
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-bold mr-2 ${METHOD_COLORS[ep.method] || "bg-gray-100"}`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs">{ep.path}</span>
                    </button>
                  ))}
                </div>
                <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                  {selectedEndpoint !== null ? (
                    (() => {
                      const ep =
                        result.analyzedApi.endpoints[selectedEndpoint];
                      return (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-mono font-bold ${METHOD_COLORS[ep.method] || "bg-gray-100"}`}
                            >
                              {ep.method}
                            </span>
                            <span className="font-mono text-sm">{ep.path}</span>
                          </div>
                          {ep.summary && (
                            <h3 className="text-lg font-semibold mb-2">
                              {ep.summary}
                            </h3>
                          )}
                          {ep.description && (
                            <p className="text-gray-600 mb-4">{ep.description}</p>
                          )}
                          {ep.authentication && ep.authentication.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Authentication
                              </h4>
                              <div className="flex gap-2">
                                {ep.authentication.map((a) => (
                                  <span
                                    key={a}
                                    className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {ep.parameters && ep.parameters.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Parameters
                              </h4>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-1">Name</th>
                                    <th className="pb-1">In</th>
                                    <th className="pb-1">Required</th>
                                    <th className="pb-1">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ep.parameters.map((p) => (
                                    <tr key={p.name} className="border-b">
                                      <td className="py-1 font-mono text-xs">
                                        {p.name}
                                      </td>
                                      <td className="py-1">{p.in}</td>
                                      <td className="py-1">
                                        {p.required ? "Yes" : "No"}
                                      </td>
                                      <td className="py-1 text-gray-500">
                                        {p.description || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {ep.requestBody && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Request Body
                              </h4>
                              {ep.requestBody.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {ep.requestBody.description}
                                </p>
                              )}
                              {ep.requestBody.content &&
                                Object.entries(ep.requestBody.content).map(
                                  ([mediaType, mediaObj]: [string, any]) => (
                                    <div key={mediaType}>
                                      <code className="text-xs bg-gray-100 px-1 rounded">
                                        {mediaType}
                                      </code>
                                      {mediaObj.example && (
                                        <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                                          {JSON.stringify(
                                            mediaObj.example,
                                            null,
                                            2
                                          )}
                                        </pre>
                                      )}
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                          {ep.responses && ep.responses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Responses
                              </h4>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-1">Status</th>
                                    <th className="pb-1">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ep.responses.map((r) => (
                                    <tr key={r.statusCode} className="border-b">
                                      <td className="py-1 font-mono text-xs">
                                        {r.statusCode}
                                      </td>
                                      <td className="py-1">{r.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      Select an endpoint to view details
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "openapi" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <pre className="text-xs overflow-x-auto max-h-[600px] overflow-y-auto">
                  {JSON.stringify(result.openApi, null, 2)}
                </pre>
              </div>
            )}

            {activeTab === "markdown" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <pre className="text-xs whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                  {result.markdown}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
