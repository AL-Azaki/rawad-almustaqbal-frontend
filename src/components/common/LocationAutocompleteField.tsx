import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SERVICE_AREAS, type ServiceArea } from '../../data/serviceAreas';
import { Input } from '../ui/Input';
import { trackLocationSelect } from '../../lib/analytics';

/**
 * Hook to source service areas. Currently returns static SERVICE_AREAS from data/serviceAreas.ts.
 * Designed so that future migration to an API/database requires modifying ONLY this hook's internal fetching logic,
 * keeping the UI and autocomplete component completely unchanged.
 */
export function useServiceAreas(): { areas: ServiceArea[]; loading: boolean } {
  return useMemo(() => ({ areas: SERVICE_AREAS, loading: false }), []);
}

interface LocationAutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocompleteField({
  value,
  onChange,
  id = 'contact-location',
  required = true,
  label,
  placeholder,
  className = '',
}: LocationAutocompleteFieldProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { areas } = useServiceAreas();

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matching suggestions
  const suggestions = useMemo(() => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return [];

    return areas.filter((area) => {
      const name = isEn ? area.nameEn.toLowerCase() : area.name.toLowerCase();
      const slug = area.slug.toLowerCase();
      return name.includes(trimmed) || slug.includes(trimmed);
    }).slice(0, 6);
  }, [value, areas, isEn]);

  // Quick area badges to show below the input
  const quickBadges = useMemo(() => {
    return areas.slice(0, 8);
  }, [areas]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (areaName: string) => {
    onChange(areaName);
    trackLocationSelect(areaName, 'location_autocomplete');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && value.trim().length >= 2 && suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
      e.preventDefault();
      const selected = suggestions[highlightedIndex];
      handleSelect(isEn ? selected.nameEn : selected.name);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const placeholderText = placeholder || t(
    'contact.locationExamplePlaceholder',
    isEn ? 'e.g. Al Yaqout District - Prince Abdullah Al-Faisal Rd' : 'مثال: حي الياقوت - طريق الأمير عبدالله الفيصل أو حي المرجان...'
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label || t('contact.formLocation', 'الحي / الموقع')} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </div>
        <Input
          id={id}
          type="text"
          name="location"
          required={required}
          minLength={4}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (value.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={`${id}-suggestions`}
          className="!w-full !pr-12 !pl-4 !bg-gray-50 dark:!bg-gray-700"
          placeholder={placeholderText}
        />
      </div>

      {/* Autocomplete Dropdown Listbox */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          role="listbox"
          aria-label={isEn ? 'Location Suggestions' : 'مقترحات الأحياء والمواقع'}
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1.5 shadow-xl border border-gray-200 dark:border-gray-700 text-sm animate-in fade-in zoom-in-95 duration-150"
        >
          {suggestions.map((area, idx) => {
            const displayName = isEn ? area.nameEn : area.name;
            const isSelected = highlightedIndex === idx;
            return (
              <li
                key={area.id}
                id={`${id}-option-${area.id}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => handleSelect(displayName)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`cursor-pointer px-4 py-2.5 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="truncate">{displayName}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                  {area.category === 'north_All Saudi Arabia Regions'
                    ? isEn ? 'All Saudi Arabia Regions' : 'جميع مناطق المملكة'
                    : area.category === 'south_All Saudi Arabia Regions'
                    ? isEn ? 'All Saudi Arabia Regions' : 'جميع مناطق المملكة'
                    : isEn ? 'Nearby District' : 'حي مجاور'}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Quick Area Badges */}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          {t('contact.quickAreasLabel', isEn ? 'Quick Service Areas (Tap to select):' : 'أحياء وتغطية سريعة (اضغط للتعبئة):')}
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={isEn ? 'Quick Area Selection Badges' : 'أزرار اختيار الأحياء السريعة'}>
          {quickBadges.map((area) => {
            const displayName = isEn ? area.nameEn : area.name;
            const isCurrent = value === displayName;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => handleSelect(displayName)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-200 flex items-center gap-1 font-medium ${
                  isCurrent
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm scale-105'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
                aria-label={`${isEn ? 'Select district' : 'اختيار حي'}: ${displayName}`}
              >
                <span>{displayName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

