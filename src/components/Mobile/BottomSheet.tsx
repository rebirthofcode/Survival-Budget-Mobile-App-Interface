import React, { useEffect, useState, useRef } from 'react';
import { XIcon } from 'lucide-react';
type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'small' | 'medium' | 'large' | 'full';
};
export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'medium'
}: BottomSheetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Map height prop to percentage values
  const heightMap = {
    small: '30vh',
    medium: '50vh',
    large: '75vh',
    full: '92vh'
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
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sheetRef.current) return;
    setCurrentY(e.touches[0].clientY);
    const deltaY = currentY - startY;
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      e.preventDefault();
    }
  };
  const handleTouchEnd = () => {
    if (!isDragging || !sheetRef.current) return;
    const deltaY = currentY - startY;
    // If dragged down more than 100px, close the sheet
    if (deltaY > 100) {
      onClose();
    } else {
      // Otherwise snap back
      sheetRef.current.style.transition = 'transform 0.3s ease-out';
      sheetRef.current.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transition = '';
        }
      }, 300);
    }
    setIsDragging(false);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div ref={sheetRef} className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-out" style={{
      height: heightMap[height],
      maxHeight: '92vh'
    }} onClick={e => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="w-full h-6 flex items-center justify-center cursor-grab" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        {/* Header */}
        {title && <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <XIcon className="h-5 w-5" />
            </button>
          </div>}
        {/* Content */}
        <div ref={contentRef} className="overflow-y-auto px-4 pb-safe-area-bottom" style={{
        height: title ? `calc(${heightMap[height]} - 48px)` : `calc(${heightMap[height]} - 24px)`
      }}>
          {children}
        </div>
      </div>
    </div>;
};