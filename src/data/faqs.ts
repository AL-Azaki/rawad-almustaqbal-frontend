import { useMemo } from 'react';

export interface FAQItem {
  id: string;
  translationKey: string;
  category: 'general' | 'technical' | 'local' | 'pricing';
  displayOrder: number;
}

/**
 * Centralized FAQ Dataset (SSOT for metadata).
 * Contains ONLY metadata keys and structure without hardcoded translated text.
 */
export const FAQ_METADATA: FAQItem[] = [
  {
    id: 'pricing',
    translationKey: 'faq.pricing',
    category: 'pricing',
    displayOrder: 1,
  },
  {
    id: 'golden_warranty',
    translationKey: 'faq.golden_warranty',
    category: 'general',
    displayOrder: 2,
  },
  {
    id: 'installation_All Saudi Arabia Regions',
    translationKey: 'faq.installation_All Saudi Arabia Regions',
    category: 'local',
    displayOrder: 3,
  },
  {
    id: 'safety_standards',
    translationKey: 'faq.safety_standards',
    category: 'technical',
    displayOrder: 4,
  },
  {
    id: 'smart_home_diff',
    translationKey: 'faq.smart_home_diff',
    category: 'technical',
    displayOrder: 5,
  },
  {
    id: 'emergency_response',
    translationKey: 'faq.emergency_response',
    category: 'local',
    displayOrder: 6,
  },
  {
    id: 'consultation',
    translationKey: 'faq.consultation',
    category: 'general',
    displayOrder: 7,
  },
  {
    id: 'payment_methods',
    translationKey: 'faq.payment_methods',
    category: 'pricing',
    displayOrder: 8,
  },
];

/**
 * Hook to retrieve FAQ items.
 * Supports future scalability: when migrating from static metadata to an API/database,
 * only this hook's internal fetching logic needs to change.
 */
export function useFAQs(): { faqs: FAQItem[]; loading: boolean } {
  return useMemo(() => ({ faqs: FAQ_METADATA, loading: false }), []);
}

