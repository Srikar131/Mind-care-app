export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-8">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Important Medical Disclaimer
              </h2>
              <p className="text-red-700 dark:text-red-300 text-sm">
                MindCare is NOT a substitute for professional mental health care, therapy, or medical treatment. 
                Our AI chatbot is designed to provide supportive conversations and coping strategies, but it cannot 
                diagnose, treat, or cure mental health conditions. If you are experiencing a mental health crisis 
                or emergency, please contact emergency services (911), the National Suicide Prevention Lifeline 
                (988), or your local crisis center immediately.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing and using MindCare, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Description of Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                MindCare provides AI-powered mental health support tools including chatbot conversations, 
                journaling features, and mood tracking. These tools are designed to supplement, not replace, 
                professional mental health care.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to use the service only for lawful purposes</li>
                <li>You understand this service is not a replacement for professional mental health care</li>
                <li>You will seek professional help if experiencing severe mental health symptoms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Crisis Resources
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  If you're in crisis, contact these resources immediately:
                </p>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• National Suicide Prevention Lifeline: 988</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• Emergency Services: 911</li>
                  <li>• National Alliance on Mental Illness (NAMI): 1-800-950-NAMI</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                MindCare and its providers shall not be liable for any direct, indirect, incidental, special, 
                or consequential damages resulting from the use or inability to use the service.
              </p>
            </section>

            <div className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you have any questions about these Terms of Service, please contact us at terms@mindcare.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}