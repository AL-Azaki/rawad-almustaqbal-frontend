import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronsLeftRight, Sparkles, AlertTriangle } from 'lucide-react';

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  initialSliderPosition?: number; // 0 to 100 percentage
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  beforeAlt,
  afterAlt,
  className = '',
  initialSliderPosition = 50,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [sliderPosition, setSliderPosition] = useState<number>(initialSliderPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bilingual default labels according to TASK-ENG-014 acceptance criteria
  const defaultBeforeLabel = isAr ? 'قبل الصيانة والتنظيم' : 'Before Maintenance & Organization';
  const defaultAfterLabel = isAr ? 'بعد التنفيذ الهندسي لرواد المستقبل' : 'After Future Pioneers Engineering Execution';

  const displayBeforeLabel = beforeLabel || defaultBeforeLabel;
  const displayAfterLabel = afterLabel || defaultAfterLabel;

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let position = ((clientX - rect.left) / rect.width) * 100;

      // Clamp between 0% and 100%
      if (position < 0) position = 0;
      if (position > 100) position = 100;

      setSliderPosition(position);
    },
    []
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 5;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={isAr ? 'مقارنة قبل وبعد التنفيذ' : 'Before and after comparison slider'}
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`relative w-full overflow-hidden rounded-3xl select-none cursor-ew-resize border border-gray-200 dark:border-gray-700 shadow-xl bg-gray-950 group focus:outline-none focus:ring-4 focus:ring-amber-500/50 transition-shadow ${className}`}
      style={{ minHeight: '340px' }}
    >
      {/* Background Image: AFTER (Underneath layer, showing full engineered result) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={afterImage}
          alt={afterAlt || displayAfterLabel}
          loading="lazy"
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* After Badge */}
        <div
          className={`absolute top-4 ${
            isAr ? 'left-4' : 'right-4'
          } z-10 px-3.5 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs sm:text-sm shadow-lg border border-emerald-400/30 flex items-center gap-1.5 pointer-events-none transition-opacity duration-300 ${
            sliderPosition > 85 ? 'opacity-20' : 'opacity-100'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-200" aria-hidden="true" />
          <span>{displayAfterLabel}</span>
        </div>
      </div>

      {/* Foreground Image: BEFORE (Overlaid and clipped via clip-path based on sliderPosition) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt || displayBeforeLabel}
          loading="lazy"
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Before Badge */}
        <div
          className={`absolute top-4 ${
            isAr ? 'right-4' : 'left-4'
          } z-10 px-3.5 py-1.5 rounded-full bg-red-600/90 backdrop-blur-md text-white font-bold text-xs sm:text-sm shadow-lg border border-red-400/30 flex items-center gap-1.5 pointer-events-none transition-opacity duration-300 ${
            sliderPosition < 15 ? 'opacity-20' : 'opacity-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-200" aria-hidden="true" />
          <span>{displayBeforeLabel}</span>
        </div>
      </div>

      {/* Vertical Divider Line & Draggable Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-amber-500 pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl border-2 border-white transform transition-transform duration-150 ${
            isDragging ? 'scale-125 ring-4 ring-amber-400/50' : 'group-hover:scale-110'
          }`}
        >
          <ChevronsLeftRight className="w-5 h-5 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom Hint for Interaction */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-200 text-xs font-medium border border-white/10 opacity-75 group-hover:opacity-100 transition-opacity">
          {isAr ? '↔ اسحب شريط المقارنة لرؤية التحول' : '↔ Drag slider to compare before & after'}
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
