import React, { useEffect } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

// Re-export the hook for convenience
export { useHapticFeedback } from '../../hooks/useHapticFeedback';

type HapticFeedbackProps = {
  children: React.ReactNode;
};

export const HapticFeedback = ({
  children
}: HapticFeedbackProps) => {
  const haptic = useHapticFeedback();

  // Add haptic feedback to all buttons within this component
  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    const handleButtonClick = () => {
      haptic.trigger('light');
    };
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, [haptic]);

  return <div className="haptic-feedback-container">{children}</div>;
};