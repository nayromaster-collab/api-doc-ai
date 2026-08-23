export const metadata = {
  title: "Security",
  description: "Security information for API Doc AI",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 mt-8">How we protect your code</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Source code is processed temporarily and not stored permanently</li>
            <li>Path traversal attacks are blocked by validated file access</li>
            <li>Sensitive files (.env, SSH keys, credentials) are never read</li>
            <li>Error messages are sanitized to prevent information leakage</li>
            <li>Rate limiting prevents abuse of the analysis endpoint</li>
            <li>File count and depth limits prevent resource exhaustion</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">What we never access</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Environment variables (.env files)</li>
            <li>SSH keys or private keys</li>
            <li>Database credentials</li>
            <li>API tokens or secrets</li>
            <li>Git configuration or credentials</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">AI provider security</h2>
          <p>
            When using the OpenAI provider, only extracted route metadata (endpoint
            paths, methods, parameters, validation rules) is sent. Raw source code
            is never transmitted to AI providers.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Reporting vulnerabilities</h2>
          <p>
            If you discover a security vulnerability, please report it responsibly
            by emailing security@apidocai.com. We will respond within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
