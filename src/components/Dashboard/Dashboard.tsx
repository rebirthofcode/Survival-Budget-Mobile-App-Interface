import React from 'react';
import { BarChart3Icon, CalendarIcon, PiggyBankIcon, TrendingUpIcon, BellIcon, SettingsIcon, ArrowRightIcon, HomeIcon, CarIcon, CoffeeIcon } from 'lucide-react';
import { Logo } from '../Logo/Logo';
type DashboardProps = {
  userName: string;
  onStartBudgeting: () => void;
  onViewProfile: () => void;
};
export const Dashboard = ({
  userName,
  onStartBudgeting,
  onViewProfile
}: DashboardProps) => {
  return <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Welcome back, {userName}!
        </h2>
        <p className="text-gray-600">
          Your financial journey continues. Let's make every dollar count.
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <BarChart3Icon className="h-5 w-5 text-orange-600 mr-2" />
          <h3 className="font-medium text-gray-900">Budget Status</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You haven't created a budget yet. Start now to see your financial
          priorities.
        </p>
        <button onClick={onStartBudgeting} className="w-full py-2 px-4 bg-orange-600 text-white rounded-md font-medium shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center">
          Create Your Budget
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Budget Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Survival</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <CarIcon className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Important</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
              <CoffeeIcon className="h-5 w-5 text-pink-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Quality</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">Budget Timeline</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create your first budget to start tracking your progress over time.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <TrendingUpIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">Financial Goals</h3>
          </div>
          <p className="text-sm text-gray-600">
            Set up goals to work towards financial freedom.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <PiggyBankIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-900">Savings Potential</h3>
        </div>
        <p className="text-sm text-gray-600">
          After creating your budget, we'll help you identify areas where you
          can save.
        </p>
      </div>
    </div>;
};