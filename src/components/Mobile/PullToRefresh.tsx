import React, { useState, useRef } from 'react';
import { RefreshCwIcon } from 'lucide-react';
type PullToRefreshProps = {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
};
export const PullToRefresh = ({
  onRefresh,
  children
}: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh when at the top of the page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    currentY.current = e.touches[0].clientY;
    const pullDistance = currentY.current - startY.current;
    // Only allow pulling down
    if (pullDistance > 0 && contentRef.current) {
      // Apply resistance to the pull
      const newTransform = Math.min(pullDistance * 0.3, 80);
      contentRef.current.style.transform = `translateY(${newTransform}px)`;
      e.preventDefault();
    }
  };
  const handleTouchEnd = async () => {
    if (!isPulling || !contentRef.current) return;
    const pullDistance = currentY.current - startY.current;
    // If pulled enough, trigger refresh
    if (pullDistance > 60) {
      setRefreshing(true);
      contentRef.current.style.transform = 'translateY(60px)';
      try {
        await onRefresh();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Refresh failed:', error);
        }
      }
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'transform 0.3s ease-out';
          contentRef.current.style.transform = 'translateY(0)';
          setTimeout(() => {
            setRefreshing(false);
            if (contentRef.current) {
              contentRef.current.style.transition = '';
            }
          }, 300);
        }
      }, 1000);
    } else {
      // Not pulled enough, snap back
      contentRef.current.style.transition = 'transform 0.3s ease-out';
      contentRef.current.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = '';
        }
      }, 300);
    }
    setIsPulling(false);
  };
  return <div className="relative w-full overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="absolute top-0 left-0 right-0 flex justify-center" style={{
      height: '60px',
      transform: 'translateY(-100%)',
      opacity: refreshing ? 1 : 0,
      transition: 'opacity 0.2s ease-out'
    }}>
        <div className="flex items-center justify-center h-full">
          <RefreshCwIcon className={`h-6 w-6 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="ml-2 text-sm text-gray-600">
            {refreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>;
};