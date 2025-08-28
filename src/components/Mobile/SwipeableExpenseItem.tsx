import React, { useState, useRef } from 'react';
import { DollarSignIcon, TrashIcon, EditIcon } from 'lucide-react';
type SwipeableExpenseItemProps = {
  expense: {
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
  };
  onToggle: () => void;
  onEdit: (amount: number) => void;
  onDelete: () => void;
};
export const SwipeableExpenseItem = ({
  expense,
  onToggle,
  onEdit,
  onDelete
}: SwipeableExpenseItemProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(expense.amount.toString());
  const startX = useRef(0);
  const currentX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);
  // Simulate haptic feedback
  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    // Only allow swiping left (negative values)
    if (diff < 0 && itemRef.current) {
      // Limit swipe to -150px
      const newOffset = Math.max(diff, -150);
      setSwipeOffset(newOffset);
      itemRef.current.style.transform = `translateX(${newOffset}px)`;
      // Trigger haptic feedback at threshold points
      if (newOffset <= -75 && swipeOffset > -75) {
        triggerHapticFeedback();
      }
    }
  };
  const handleTouchEnd = () => {
    if (itemRef.current) {
      // If swiped more than 75px, snap to -150px
      if (swipeOffset < -75) {
        setSwipeOffset(-150);
        itemRef.current.style.transform = 'translateX(-150px)';
        itemRef.current.style.transition = 'transform 0.2s ease-out';
        triggerHapticFeedback();
      } else {
        // Otherwise snap back
        setSwipeOffset(0);
        itemRef.current.style.transform = 'translateX(0)';
        itemRef.current.style.transition = 'transform 0.2s ease-out';
      }
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.style.transition = '';
        }
      }, 200);
    }
  };
  const resetSwipe = () => {
    if (itemRef.current) {
      setSwipeOffset(0);
      itemRef.current.style.transform = 'translateX(0)';
      itemRef.current.style.transition = 'transform 0.2s ease-out';
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.style.transition = '';
        }
      }, 200);
    }
  };
  const handleEdit = () => {
    triggerHapticFeedback();
    setIsEditing(true);
    resetSwipe();
  };
  const handleDelete = () => {
    triggerHapticFeedback();
    // Add a confirmation animation before deleting
    if (itemRef.current) {
      itemRef.current.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      itemRef.current.style.opacity = '0';
      itemRef.current.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        onDelete();
        resetSwipe();
      }, 300);
    } else {
      onDelete();
      resetSwipe();
    }
  };
  const handleSave = () => {
    triggerHapticFeedback();
    onEdit(parseInt(amount) || 0);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setAmount(expense.amount.toString());
    setIsEditing(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };
  return <div className="relative overflow-hidden">
      {/* Swipe actions background */}
      <div className="absolute right-0 top-0 bottom-0 flex h-full">
        <button onClick={handleEdit} className="bg-blue-500 text-white flex items-center justify-center w-[75px] h-full" aria-label="Edit expense">
          <EditIcon className="h-5 w-5" />
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white flex items-center justify-center w-[75px] h-full" aria-label="Delete expense">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      {/* Main item content */}
      <div ref={itemRef} className="bg-white relative z-10 touch-pan-y" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 last:border-0">
          <div className="flex-1">
            <span className="text-gray-800 font-medium">{expense.name}</span>
          </div>
          {isEditing ? <div className="flex items-center">
              <div className="relative w-24 mr-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSignIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-right" value={amount} onChange={handleChange} inputMode="numeric" autoFocus aria-label={`Amount for ${expense.name}`} />
              </div>
              <div className="flex space-x-2">
                <button onClick={handleCancel} className="bg-gray-200 text-gray-800 px-2 py-2 rounded-md text-sm" aria-label="Cancel editing">
                  Cancel
                </button>
                <button onClick={handleSave} className="bg-orange-500 text-white px-2 py-2 rounded-md text-sm" aria-label="Save changes">
                  Save
                </button>
              </div>
            </div> : <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-4">
                ${expense.amount}
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={expense.enabled} onChange={() => {
                triggerHapticFeedback();
                onToggle();
              }} aria-label={`Toggle ${expense.name}`} />
                  <div className={`block w-14 h-8 rounded-full ${expense.enabled ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-200`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${expense.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>}
        </div>
      </div>
      {/* Hint for swipe */}
      {swipeOffset === 0 && !isEditing && <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 text-xs animate-pulse">
          Swipe left
        </div>}
    </div>;
};