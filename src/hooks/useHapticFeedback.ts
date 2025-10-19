import { HAPTIC_DURATION } from '../constants';

export const useHapticFeedback = () => {
  return {
    trigger: (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
      if (navigator.vibrate) {
        switch (intensity) {
          case 'light':
            navigator.vibrate(HAPTIC_DURATION.LIGHT);
            break;
          case 'medium':
            navigator.vibrate(HAPTIC_DURATION.MEDIUM);
            break;
          case 'heavy':
            navigator.vibrate(HAPTIC_DURATION.HEAVY_PATTERN);
            break;
          default:
            navigator.vibrate(HAPTIC_DURATION.MEDIUM);
        }
      }
    }
  };
};
