import React, { useState } from 'react';
import { ArrowRightIcon, UserIcon, MailIcon, LockIcon, SaveIcon, BarChartIcon, RefreshCwIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';
type SignupFormProps = {
  onComplete: (userData: {
    firstName: string;
    email: string;
  }) => void;
};
export const SignupForm = ({
  onComplete
}: SignupFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      email: '',
      password: ''
    };
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, you would send this data to a server
      // For now, we'll just store it in localStorage
      localStorage.setItem('user', JSON.stringify({
        firstName,
        email
      }));
      onComplete({
        firstName,
        email
      });
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-start mb-6">
        <Logo variant="dark" size="md" withText={true} tagline={true} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Create your account
      </h2>
      <p className="text-gray-600 mb-6">
        Set up your account to save your budget and get personalized insights.
      </p>
      <div className="mb-6 grid grid-cols-1 gap-4">
        <div className="bg-orange-50 p-3 rounded-lg flex flex-col items-center text-center">
          <SaveIcon className="h-6 w-6 text-orange-600 mb-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Save Your Budget
          </h3>
          <p className="text-xs text-gray-600">
            Keep track of your progress over time
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg flex flex-col items-center text-center">
          <BarChartIcon className="h-6 w-6 text-orange-600 mb-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Personalized Insights
          </h3>
          <p className="text-xs text-gray-600">
            Get recommendations based on your spending
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg flex flex-col items-center text-center">
          <RefreshCwIcon className="h-6 w-6 text-orange-600 mb-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Sync Across Devices
          </h3>
          <p className="text-xs text-gray-600">Access your budget anywhere</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Your first name" />
          </div>
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="you@example.com" />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="At least 6 characters" />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <button type="submit" className="w-full py-3 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          Create Account
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </form>
      <p className="text-xs text-gray-500 text-center mt-4">
        By creating an account, you'll get a personalized budget experience with
        saved preferences and progress tracking.
      </p>
    </div>;
};