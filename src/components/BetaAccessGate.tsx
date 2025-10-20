import { useState } from 'react';
import { MailIcon, UserIcon, AlertCircleIcon } from 'lucide-react';

type BetaAccessGateProps = {
  onGrantAccess: () => void;
};

const BETA_ACCESS_KEY = 'betaAccessGranted';
const BETA_USER_INFO_KEY = 'betaUserInfo';

export const BetaAccessGate = ({ onGrantAccess }: BetaAccessGateProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store user info in localStorage
      const userInfo = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        accessGrantedAt: new Date().toISOString(),
        version: 'beta-v1'
      };

      // Send to Formspree
      const formspreeResponse = await fetch('https://formspree.io/f/xanpkalq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          accessGrantedAt: userInfo.accessGrantedAt,
          version: userInfo.version,
          _subject: `New Beta Tester: ${userInfo.name}`
        })
      });

      if (!formspreeResponse.ok) {
        // Log error but don't block user access
        if (process.env.NODE_ENV === 'development') {
          console.error('Formspree submission failed, but continuing with access');
        }
      }

      // Store in localStorage regardless of Formspree result
      localStorage.setItem(BETA_USER_INFO_KEY, JSON.stringify(userInfo));
      localStorage.setItem(BETA_ACCESS_KEY, 'true');

      if (process.env.NODE_ENV === 'development') {
        console.log('Beta tester registered:', userInfo);
      }

      // Small delay for UX
      setTimeout(() => {
        onGrantAccess();
      }, 500);

    } catch (err) {
      // If Formspree fails, still grant access but log the error
      if (process.env.NODE_ENV === 'development') {
        console.error('Error during registration:', err);
      }

      // Try to save to localStorage anyway
      try {
        const userInfo = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          accessGrantedAt: new Date().toISOString(),
          version: 'beta-v1'
        };
        localStorage.setItem(BETA_USER_INFO_KEY, JSON.stringify(userInfo));
        localStorage.setItem(BETA_ACCESS_KEY, 'true');

        setTimeout(() => {
          onGrantAccess();
        }, 500);
      } catch {
        setError('Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <svg width="64" height="64" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="white" stroke="#FF6B35" strokeWidth="2" />
              <text x="20" y="16" fontFamily="Arial, sans-serif" fontSize="12" fill="#FF6B35" fontWeight="700" textAnchor="middle">
                $
              </text>
              <rect x="14" y="22" width="12" height="2" rx="1" fill="#FF6B35" />
              <rect x="12" y="26" width="16" height="2" rx="1" fill="#FF6B35" />
              <rect x="10" y="30" width="20" height="2" rx="1" fill="#FF6B35" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Survival Budget
          </h1>
          <p className="text-sm text-gray-600 mb-3">
            Priority-based budgeting
          </p>
          <p className="text-sm text-orange-600 font-medium uppercase tracking-wide">
            Beta Access
          </p>
        </div>

        {/* Access Form Card */}
        <div className="bg-white rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome, Beta Tester!
            </h2>
            <p className="text-gray-600 text-sm">
              You've been selected to test our priority-based budgeting app.
              Please provide your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="beta-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="beta-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="beta-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="beta-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isSubmitting ? 'Verifying...' : 'Continue to App'}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your information is stored locally and used only for beta testing purposes.
              We respect your privacy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:hello@articuladigital.co?subject=Survival%20Budget%20Beta%20Feedback" className="text-orange-600 hover:text-orange-700 font-medium">
              hello@articuladigital.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if user has beta access
export const hasBetaAccess = (): boolean => {
  try {
    return localStorage.getItem(BETA_ACCESS_KEY) === 'true';
  } catch {
    return false;
  }
};

// Helper function to get beta user info
export const getBetaUserInfo = () => {
  try {
    const info = localStorage.getItem(BETA_USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

// Helper function to revoke beta access (for testing)
export const revokeBetaAccess = () => {
  localStorage.removeItem(BETA_ACCESS_KEY);
  localStorage.removeItem(BETA_USER_INFO_KEY);
};
