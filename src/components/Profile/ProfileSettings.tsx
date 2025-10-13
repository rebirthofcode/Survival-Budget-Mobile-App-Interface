import React, { useState } from 'react';
import { UserIcon, MailIcon, KeyIcon, BellIcon, PaletteIcon, ArrowLeftIcon, SaveIcon, UserPlusIcon, AlertCircleIcon } from 'lucide-react';

type ProfileSettingsProps = {
  userName: string;
  email: string;
  isGuestUser: boolean;
  onCreateAccount: () => void;
  onBack: () => void;
  onLogout: () => void;
};

export const ProfileSettings = ({
  userName,
  email,
  isGuestUser,
  onCreateAccount,
  onBack,
  onLogout
}: ProfileSettingsProps) => {
  const [firstName, setFirstName] = useState(userName);
  const [userEmail, setUserEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestUser) {
      alert('Please create an account to save your profile changes.');
      return;
    }
    // In a real app, this would update the user's profile
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestUser) {
      alert('Please create an account to change your password.');
      return;
    }
    // In a real app, this would update the user's password
    alert('Password updated successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-orange-600">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-lg font-medium text-gray-900">{userName}</h2>
        <p className="text-sm text-gray-600">{email}</p>
        {isGuestUser && (
          <p className="text-xs text-orange-600 font-medium mt-1">Guest User</p>
        )}
      </div>

      {isGuestUser && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex items-center mb-3">
            <AlertCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Create Your Account</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You're currently using a guest account. Create a permanent account to save your profile settings, budgets, and track your progress over time.
          </p>
          <button 
            onClick={onCreateAccount}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Create Free Account
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Account Information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="firstName" 
                type="text" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${isGuestUser ? 'bg-gray-50' : ''}`}
                disabled={isGuestUser}
              />
            </div>
            {isGuestUser && (
              <p className="text-xs text-gray-500 mt-1">Create an account to edit this field</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="email" 
                type="email" 
                value={userEmail} 
                onChange={e => setUserEmail(e.target.value)} 
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${isGuestUser ? 'bg-gray-50' : ''}`}
                disabled={isGuestUser}
              />
            </div>
            {isGuestUser && (
              <p className="text-xs text-gray-500 mt-1">Create an account to edit this field</p>
            )}
          </div>
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-md font-medium shadow-sm flex items-center justify-center ${
              isGuestUser 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            }`}
            disabled={isGuestUser}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            {isGuestUser ? 'Create Account to Save' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="currentPassword" 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${isGuestUser ? 'bg-gray-50' : ''}`}
                disabled={isGuestUser}
                placeholder={isGuestUser ? "Not available for guest users" : ""}
              />
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="newPassword" 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${isGuestUser ? 'bg-gray-50' : ''}`}
                disabled={isGuestUser}
                placeholder={isGuestUser ? "Not available for guest users" : ""}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isGuestUser 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            }`}
            disabled={isGuestUser}
          >
            {isGuestUser ? 'Create Account to Change Password' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className={`flex items-center justify-between p-3 rounded-lg ${isGuestUser ? 'bg-gray-100' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <BellIcon className={`h-5 w-5 mr-3 ${isGuestUser ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isGuestUser ? 'text-gray-500' : 'text-gray-700'}`}>Notifications</span>
            {isGuestUser && <span className="text-xs text-gray-400 ml-2">(Account required)</span>}
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="toggle" className="sr-only" disabled={isGuestUser} />
            <label htmlFor="toggle" className={`block h-6 w-10 rounded-full cursor-pointer ${isGuestUser ? 'bg-gray-300' : 'bg-gray-300'}`}></label>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <PaletteIcon className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Dark Mode</span>
            <span className="text-xs text-gray-400 ml-2">(Coming soon)</span>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="toggle-theme" className="sr-only" disabled />
            <label htmlFor="toggle-theme" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        {isGuestUser ? (
          <button 
            onClick={onLogout} 
            className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Exit Guest Mode
          </button>
        ) : (
          <button 
            onClick={onLogout} 
            className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};