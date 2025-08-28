import React, { useEffect, useState } from 'react';
import { XIcon, BellIcon, BellOffIcon } from 'lucide-react';
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};
type NotificationSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const NotificationSheet = ({
  isOpen,
  onClose
}: NotificationSheetProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([{
    id: '1',
    title: 'Budget Alert',
    message: "You've reached 90% of your grocery budget this month.",
    time: '2 hours ago',
    read: false
  }, {
    id: '2',
    title: 'Tip of the Day',
    message: 'Try reducing dining out expenses to reach your savings goal faster.',
    time: 'Yesterday',
    read: false
  }, {
    id: '3',
    title: 'Budget Update',
    message: 'Your monthly income has been updated successfully.',
    time: '3 days ago',
    read: true
  }]);
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  // Prevent body scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute inset-x-0 top-0 h-[85vh] bg-white rounded-b-xl shadow-lg transform transition-transform duration-300 ease-out" style={{
      transform: isOpen ? 'translateY(0)' : 'translateY(-100%)'
    }}>
        <div className="h-safe-area-top bg-white"></div>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          <div className="flex space-x-4">
            <button onClick={markAllAsRead} className="text-gray-600 focus:outline-none" aria-label="Mark all as read">
              <BellOffIcon className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="text-gray-600 focus:outline-none" aria-label="Close">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(85vh-120px)]">
          {notifications.length > 0 ? <div className="divide-y divide-gray-200">
              {notifications.map(notification => <div key={notification.id} className={`p-4 ${notification.read ? 'bg-white' : 'bg-orange-50'}`}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {notification.message}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => deleteNotification(notification.id)} className="text-xs text-gray-500 hover:text-red-500">
                      Dismiss
                    </button>
                  </div>
                </div>)}
            </div> : <div className="flex flex-col items-center justify-center h-full py-10">
              <BellIcon className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>}
        </div>
      </div>
    </div>;
};