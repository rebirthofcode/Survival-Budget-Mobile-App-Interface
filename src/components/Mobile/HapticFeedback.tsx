import React, { useEffect } from 'react';
type HapticFeedbackProps = {
  children: React.ReactNode;
};
export const HapticFeedback = ({
  children
}: HapticFeedbackProps) => {
  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (navigator.vibrate) {
      switch (intensity) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(15);
          break;
        case 'heavy':
          navigator.vibrate([10, 10, 20]);
          break;
        default:
          navigator.vibrate(15);
      }
    }
  };
  // Add haptic feedback to all buttons within this component
  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    const handleButtonClick = () => {
      triggerHapticFeedback('light');
    };
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, []);
  return <div className="haptic-feedback-container">{children}</div>;
};
export const useHapticFeedback = () => {
  return {
    trigger: (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
      if (navigator.vibrate) {
        switch (intensity) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(15);
            break;
          case 'heavy':
            navigator.vibrate([10, 10, 20]);
            break;
          default:
            navigator.vibrate(15);
        }
      }
    }
  };
};