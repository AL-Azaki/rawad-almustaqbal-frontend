import { CheckCircle2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.features.f1Desc')}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
              <Star className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.features.f2Desc')}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.features.f3Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

