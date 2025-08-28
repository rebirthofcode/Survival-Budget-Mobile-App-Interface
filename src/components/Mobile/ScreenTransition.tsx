import React, { useEffect, useState } from 'react';
type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'none';
type ScreenTransitionProps = {
  children: React.ReactNode;
  isActive: boolean;
  type?: TransitionType;
  duration?: number;
};
export const ScreenTransition = ({
  children,
  isActive,
  type = 'fade',
  duration = 300
}: ScreenTransitionProps) => {
  const [isVisible, setIsVisible] = useState(isActive);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);
  if (!isVisible) return null;
  const getTransitionStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms ease-in-out`
    };
    const activeStyles = {
      opacity: isActive ? 1 : 0
    };
    const typeStyles = {
      transform: isActive || !isTransitioning ? 'none' : getTransformValue()
    };
    return {
      ...baseStyles,
      ...activeStyles,
      ...typeStyles
    };
  };
  const getTransformValue = () => {
    switch (type) {
      case 'slide-left':
        return 'translateX(-100%)';
      case 'slide-right':
        return 'translateX(100%)';
      case 'slide-up':
        return 'translateY(-100%)';
      case 'slide-down':
        return 'translateY(100%)';
      default:
        return 'none';
    }
  };
  const getInitialTransform = () => {
    if (!isActive && isTransitioning) return 'none';
    switch (type) {
      case 'slide-left':
        return 'translateX(100%)';
      case 'slide-right':
        return 'translateX(-100%)';
      case 'slide-up':
        return 'translateY(100%)';
      case 'slide-down':
        return 'translateY(-100%)';
      default:
        return 'none';
    }
  };
  return <div className="screen-transition" style={{
    ...getTransitionStyles(),
    transform: isTransitioning ? getTransformValue() : getInitialTransform(),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  }}>
      {children}
    </div>;
};