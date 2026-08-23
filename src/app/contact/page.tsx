export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact</h1>
        <div className="space-y-6 text-sm text-gray-600">
          <p>
            Have questions, feedback, or need support? Reach out to us:
          </p>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <div className="font-medium text-gray-900">General inquiries</div>
              <div>hello@apidocai.com</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Support</div>
              <div>support@apidocai.com</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Security issues</div>
              <div>security@apidocai.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
