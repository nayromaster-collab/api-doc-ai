"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">API Doc AI</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </a>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Turn Your Laravel API Into
          <br />
          Beautiful Documentation
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect your Laravel project and generate professional API documentation
          automatically. OpenAPI 3.1, Markdown export, and more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Generate Docs
          </Link>
          <a
            href="#example"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            See Example
          </a>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Everything you need for API documentation
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Automatic endpoint discovery"
            description="Scans your Laravel routes, controllers, and form requests to find every API endpoint automatically."
          />
          <FeatureCard
            title="OpenAPI 3.1 generation"
            description="Generates valid OpenAPI 3.1 specifications compatible with Swagger, Redoc, and other tools."
          />
          <FeatureCard
            title="Request validation"
            description="Detects form request validation rules and includes them in the documentation."
          />
          <FeatureCard
            title="Response documentation"
            description="Documents response structures from your API Resources and controllers."
          />
          <FeatureCard
            title="Authentication detection"
            description="Identifies auth middleware and documents which endpoints require authentication."
          />
          <FeatureCard
            title="Multiple export formats"
            description="Download your documentation as OpenAPI JSON or Markdown. Copy to clipboard with one click."
          />
        </div>
      </section>

      <section id="example" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            See it in action
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-xs text-gray-400 mb-3 font-mono">routes/api.php</div>
              <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
{`Route::apiResource('products', ProductController::class);

// Generates 5 endpoints:
// GET    /api/products
// POST   /api/products
// GET    /api/products/{product}
// PUT    /api/products/{product}
// DELETE /api/products/{product}`}
              </pre>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-xs text-gray-400 mb-3 font-mono">Generated Documentation</div>
              <div className="space-y-3">
                <EndpointBadge method="GET" path="/api/products" summary="List products" />
                <EndpointBadge method="POST" path="/api/products" summary="Create product" />
                <EndpointBadge method="GET" path="/api/products/{product}" summary="Get product" />
                <EndpointBadge method="PUT" path="/api/products/{product}" summary="Update product" />
                <EndpointBadge method="DELETE" path="/api/products/{product}" summary="Delete product" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Start free, upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            features={[
              "1 project",
              "25 endpoints",
              "Basic documentation",
              "OpenAPI export",
              "Markdown export",
            ]}
            cta="Get Started"
            highlighted={false}
          />
          <PricingCard
            name="Pro"
            price="$19"
            period="/month"
            features={[
              "10 projects",
              "Unlimited endpoints",
              "OpenAPI export",
              "Markdown export",
              "Auto-regeneration",
              "Priority processing",
            ]}
            cta="Coming Soon"
            highlighted={true}
          />
          <PricingCard
            name="Agency"
            price="$49"
            period="/month"
            features={[
              "50 projects",
              "Client projects",
              "White-label docs",
              "Priority processing",
              "Team access",
            ]}
            cta="Coming Soon"
            highlighted={false}
          />
        </div>
      </section>

      <section id="faq" className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="What frameworks are supported?"
              answer="Currently, API Doc AI supports Laravel. We plan to add support for other PHP frameworks and eventually Node.js, Python, and other ecosystems."
            />
            <FaqItem
              question="Does API Doc AI send my source code to an AI provider?"
              answer="When using the OpenAI provider, only extracted route metadata (endpoints, parameters, validation rules) is sent. Source code files are not transmitted. The mock provider works entirely locally with no external calls."
            />
            <FaqItem
              question="Do you store my code?"
              answer="No. API Doc AI reads your project files temporarily during analysis and does not store any source code. Documentation is generated and returned to you directly."
            />
            <FaqItem
              question="What is OpenAPI?"
              answer="OpenAPI is a standard specification for describing REST APIs. It enables tools like Swagger UI, Redoc, and Postman to understand and display your API documentation."
            />
            <FaqItem
              question="Can I export the documentation?"
              answer="Yes. You can download your documentation as OpenAPI 3.1 JSON or Markdown. You can also copy the OpenAPI JSON to your clipboard."
            />
            <FaqItem
              question="Which Laravel versions are supported?"
              answer="API Doc AI works with Laravel 8 and later. It analyzes standard Laravel routing patterns, controllers, form requests, and API resources."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            API Doc AI. Built for Laravel developers.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms
            </Link>
            <a
              href="https://github.com/apidocai/api-doc-ai"
              className="hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-yellow-100 text-yellow-800",
  PATCH: "bg-orange-100 text-orange-800",
  DELETE: "bg-red-100 text-red-800",
};

function EndpointBadge({
  method,
  path,
  summary,
}: {
  method: string;
  path: string;
  summary: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${METHOD_COLORS[method] || "bg-gray-100"}`}
      >
        {method}
      </span>
      <span className="font-mono text-gray-700">{path}</span>
      <span className="text-gray-400">-</span>
      <span className="text-gray-600">{summary}</span>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-8 ${
        highlighted
          ? "border-blue-600 ring-1 ring-blue-600"
          : "border-gray-200"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <div className="mt-4 mb-6">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2.5 rounded-md text-sm font-medium ${
          highlighted
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-sm text-gray-600">{answer}</p>
    </div>
  );
}
