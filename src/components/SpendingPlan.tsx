import React from 'react';
import { LightbulbIcon } from 'lucide-react';
type SpendingPlanProps = {
  priorityCount: string;
};
export const SpendingPlan = ({
  priorityCount
}: SpendingPlanProps) => {
  return <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
      <div className="flex items-start">
        <LightbulbIcon className="h-6 w-6 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-gray-900">Your Spending Plan</h3>
          <p className="text-gray-700 mt-1">
            This month: Focus on Priorities {priorityCount}
          </p>
        </div>
      </div>
    </div>;
};