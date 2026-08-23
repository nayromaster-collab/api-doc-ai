export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for API Doc AI",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600">
          <p>Last updated: August 2026</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Service</h2>
          <p>
            API Doc AI provides automated API documentation generation for Laravel
            projects. The service analyzes your code to generate OpenAPI specifications
            and Markdown documentation.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Acceptable use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the service only for lawful purposes</li>
            <li>Do not attempt to access files outside your project directory</li>
            <li>Do not abuse the API or attempt to circumvent rate limits</li>
            <li>Do not use the service to process code containing malware</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Intellectual property</h2>
          <p>
            You retain all rights to your source code. Generated documentation belongs
            to you and can be used freely.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Service availability</h2>
          <p>
            We aim to provide reliable service but do not guarantee uninterrupted
            availability. We may perform maintenance that temporarily affects access.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Limitation of liability</h2>
          <p>
            API Doc AI is provided as-is. We are not liable for any damages arising
            from use of the service, including but not limited to loss of data or
            business interruption.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8">Contact</h2>
          <p>
            For questions about these terms, contact us at
            legal@apidocai.com.
          </p>
        </div>
      </div>
    </div>
  );
}
