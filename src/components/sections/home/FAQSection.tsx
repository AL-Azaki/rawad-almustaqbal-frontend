import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFAQs } from '../../../data/faqs';
import { FAQSchema } from '../../seo/FAQSchema';

export const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const { faqs, loading } = useFAQs();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (idx + 1) % faqs.length;
      const nextBtn = document.getElementById(`faq-btn-${faqs[nextIdx].id}`);
      nextBtn?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (idx - 1 + faqs.length) % faqs.length;
      const prevBtn = document.getElementById(`faq-btn-${faqs[prevIdx].id}`);
      prevBtn?.focus();
    }
  };

  if (loading || !faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section 
      aria-labelledby="faq-section-title"
      className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800"
    >
      {/* Inject FAQPage Schema JSON-LD via react-helmet-async */}
      <FAQSchema />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t('faq.badge', 'الأسئلة الشائعة 💡')}</span>
          </div>
          <h2 
            id="faq-section-title"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
          >
            {t('faq.title', 'إجابات واضحة لجميع')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('faq.titleHighlight', 'استفساراتك التقنية والفنية')}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('faq.subtitle', 'نؤمن في رواد المستقبل بالشفافية المطلقة. إليك الإجابات المفصلة عن أكثر الأسئلة شيوعاً حول التأسيس، التركيب، الضمان، وخدماتنا في جدة وأبحر.')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4" role="region" aria-label={t('faq.badge', 'الأسئلة الشائعة')}>
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const questionText = t(`${faq.translationKey}.q`);
            const answerText = t(`${faq.translationKey}.a`);

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-amber-50/40 dark:bg-gray-800/90 border-amber-500/50 dark:border-amber-500/40 shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/30 dark:hover:border-gray-600'
                }`}
              >
                <h3>
                  <button
                    id={`faq-btn-${faq.id}`}
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    className="w-full py-5 px-6 md:px-8 flex items-center justify-between gap-4 text-right focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset transition-colors"
                  >
                    <span className="font-bold text-base md:text-lg text-gray-900 dark:text-white leading-snug flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" aria-hidden="true"></span>
                      <span>{questionText}</span>
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-amber-500 text-white rotate-180'
                          : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:text-amber-500'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-8 pb-6 pt-1 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                      {answerText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
