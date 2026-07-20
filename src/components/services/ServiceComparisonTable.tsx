import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Scale } from 'lucide-react';

export const ServiceComparisonTable: React.FC = () => {
  const { t } = useTranslation();

  const rows = [1, 2, 3, 4, 5];

  return (
    <section 
      aria-labelledby="comparison-table-title"
      className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 p-6 md:p-10 my-12 shadow-xl transition-colors duration-300"
    >
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4 shadow-sm">
          <Scale className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t('comparisonTable.badge', 'مقارنة فنية هندسية ⚖️')}</span>
        </div>
        <h2 
          id="comparison-table-title"
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
        >
          {t('comparisonTable.title', 'الفرق الجوهري بين')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('comparisonTable.titleHighlight', 'هندسة رواد المستقبل والمقاولة العادية')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          {t('comparisonTable.subtitle', 'لا تخاطر بسلامة وجودة منشأتك. تعرف على المعايير الفنية التي تميز أعمالنا عن التنفيذ التقليدي في السوق.')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <table className="w-full border-collapse text-right rtl:text-right ltr:text-left">
          <thead>
            <tr className="bg-gray-100/80 dark:bg-gray-700/80 border-b border-gray-200 dark:border-gray-600">
              <th scope="col" className="py-5 px-4 md:px-6 text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 w-1/4">
                {t('comparisonTable.colFeature', 'وجه المقارنة والمعيار الفني')}
              </th>
              <th scope="col" className="py-5 px-4 md:px-6 text-sm md:text-base font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20 w-3/8 border-x border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
                  <span>{t('comparisonTable.colModern', 'التأسيس الهندسي الذكي (رواد المستقبل)')}</span>
                </div>
              </th>
              <th scope="col" className="py-5 px-4 md:px-6 text-sm md:text-base font-bold text-gray-500 dark:text-gray-400 w-3/8">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
                  <span>{t('comparisonTable.colTraditional', 'التأسيس التقليدي العادي في السوق')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm md:text-base">
            {rows.map((rowNum) => (
              <tr key={rowNum} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/40 transition-colors">
                <th scope="row" className="py-5 px-4 md:px-6 font-bold text-gray-900 dark:text-white align-top bg-gray-50/30 dark:bg-gray-800/40">
                  {t(`comparisonTable.row${rowNum}_title`)}
                </th>
                <td className="py-5 px-4 md:px-6 font-medium text-gray-800 dark:text-gray-200 align-top bg-amber-50/20 dark:bg-amber-900/10 border-x border-gray-200 dark:border-gray-700 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" aria-hidden="true" />
                    <span>{t(`comparisonTable.row${rowNum}_modern`)}</span>
                  </div>
                </td>
                <td className="py-5 px-4 md:px-6 text-gray-500 dark:text-gray-400 align-top leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-400/80 shrink-0 mt-1" aria-hidden="true" />
                    <span>{t(`comparisonTable.row${rowNum}_traditional`)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServiceComparisonTable;
