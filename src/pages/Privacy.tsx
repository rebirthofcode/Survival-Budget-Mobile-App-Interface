export const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg width="48" height="48" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="white" stroke="#FF6B35" strokeWidth="2" />
              <text x="20" y="16" fontFamily="Arial, sans-serif" fontSize="12" fill="#FF6B35" fontWeight="700" textAnchor="middle">
                $
              </text>
              <rect x="14" y="22" width="12" height="2" rx="1" fill="#FF6B35" />
              <rect x="12" y="26" width="16" height="2" rx="1" fill="#FF6B35" />
              <rect x="10" y="30" width="20" height="2" rx="1" fill="#FF6B35" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Survival Budget</h2>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Your data stays on your device
            </h2>
            <p className="leading-relaxed">
              Survival Budget stores all your information directly in your browser. Nothing is sent to our servers. Nothing is stored in a database. Your income, expenses, and budget details never leave your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              What we collect
            </h2>
            <p className="leading-relaxed">
              We collect your name and email when you access the beta. This information goes to Formspree (a third party service) so we can contact you about updates and improvements.
            </p>
            <p className="leading-relaxed mt-3">
              Your actual budget data (income and expenses) is stored only in your browser using localStorage. We cannot see it. We do not track it. We have no access to it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              How to delete your data
            </h2>
            <p className="leading-relaxed">
              You can delete all your budget data at any time by clearing your browser data or visiting our <a href="/CLEAR_DATA.html" className="text-orange-600 hover:text-orange-700 font-medium">data clearing tool</a>.
            </p>
            <p className="leading-relaxed mt-3">
              If you want us to delete your name and email from our beta tester list, send an email to <a href="mailto:hello@articulatedigital.co?subject=Delete%20My%20Data" className="text-orange-600 hover:text-orange-700 font-medium">hello@articulatedigital.co</a> with the subject "Delete My Data."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Third party services
            </h2>
            <p className="leading-relaxed">
              We use Formspree to collect beta tester emails. Formspree has its own privacy policy available at <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">formspree.io/legal/privacy-policy</a>.
            </p>
            <p className="leading-relaxed mt-3">
              We host this site on Netlify. Netlify may collect basic web analytics (page visits, browser types). Their privacy policy is at <a href="https://www.netlify.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-medium">netlify.com/privacy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Questions
            </h2>
            <p className="leading-relaxed">
              If you have questions about privacy or how we handle data, contact us at <a href="mailto:hello@articulatedigital.co?subject=Privacy%20Question" className="text-orange-600 hover:text-orange-700 font-medium">hello@articulatedigital.co</a>.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Last updated: October 21, 2025
            </p>
          </section>
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Survival Budget
          </a>
        </div>
      </div>
    </div>
  );
};
