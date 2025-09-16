export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use the information we collect to provide, maintain, and improve our services, 
                including to provide personalized mental health support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Mental Health Specific Considerations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We understand the sensitive nature of mental health information. Your conversations and journal entries 
                are encrypted and stored securely. We do not share your personal mental health information with third parties 
                without your explicit consent, except as required by law.
              </p>
            </section>

            <div className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you have any questions about this Privacy Policy, please contact us at privacy@mindcare.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}