export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for API Doc AI",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600">
          <p>Last updated: August 2026</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">What we collect</h2>
          <p>
            API Doc AI collects only the information necessary to provide the service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email, name) if you create an account</li>
            <li>Laravel project path or GitHub repository connection for analysis</li>
            <li>Usage data (number of projects analyzed, endpoints processed)</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Source code handling</h2>
          <p>
            API Doc AI reads your source code temporarily during analysis to extract API
            route information. Source code is processed locally or in a secure server
            environment and is not stored permanently. Depending on your configuration,
            extracted route metadata (endpoints, parameters, validation rules) may be
            sent to an AI provider for documentation generation. Raw source code is not
            sent to AI providers.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">What we do not collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not store your source code</li>
            <li>We do not access environment variables or secrets</li>
            <li>We do not read .env files, SSH keys, or credentials</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Data storage</h2>
          <p>
            Generated documentation metadata may be stored to provide the service.
            You can delete your projects and associated data at any time.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Third-party services</h2>
          <p>
            If you configure the OpenAI provider, route metadata is sent to OpenAI
            for processing. OpenAI&apos;s privacy policy applies to that data.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Contact</h2>
          <p>
            For questions about this privacy policy, contact us at
            privacy@apidocai.com.
          </p>
        </div>
      </div>
    </div>
  );
}
