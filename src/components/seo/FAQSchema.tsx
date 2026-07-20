import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useFAQs } from '../../data/faqs';

/**
 * Separated structured data layer component (`FAQPage Schema`).
 * Consumes the exact same FAQ metadata and translation keys as the visual Accordion component (`FAQSection`).
 * Injects Schema Markup dynamically via react-helmet-async without duplicating content or presentation logic.
 */
export const FAQSchema: React.FC = () => {
  const { t } = useTranslation();
  const { faqs } = useFAQs();

  if (!faqs || faqs.length === 0) return null;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: t(`${faq.translationKey}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${faq.translationKey}.a`),
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;
