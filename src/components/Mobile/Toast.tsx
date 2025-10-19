import { useEffect } from 'react';
import { XIcon, CheckCircleIcon } from 'lucide-react';

export type ToastProps = {
  message: string;
  type?: 'success' | 'info' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
  duration?: number;
};

export const Toast = ({
  message,
  type = 'info',
  action,
  onClose,
  duration = 5000
}: ToastProps) => {
  useEffect(() => {
    if (!action) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, action, onClose]);

  const bgColor = type === 'success'
    ? 'bg-green-600'
    : type === 'error'
    ? 'bg-orange-600'
    : 'bg-gray-800';

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-between animate-slide-up`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center flex-1">
        {type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />}
        <p className="text-sm font-medium">{message}</p>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className="text-sm font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-2 py-1"
          >
            {action.label}
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
