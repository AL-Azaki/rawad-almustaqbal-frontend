import { CheckCircle2, Zap, Wifi, Camera, Droplets, Lightbulb, PaintRoller, PenTool, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const serviceCategories = [
  { key: 'electrical', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', slug: 'electrical-services-jeddah' },
  { key: 'network', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', slug: 'network-internet-setup-jeddah' },
  { key: 'surveillance', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', slug: 'cctv-security-systems-jeddah' },
  { key: 'plumbing', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10', slug: 'plumbing-maintenance-jeddah' },
  { key: 'lighting', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', slug: 'lighting-decor-jeddah' },
  { key: 'interior', icon: PaintRoller, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', slug: 'interior-decor-gypsum-jeddah' },
  { key: 'additional', icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', slug: '' },
];

export function ServicesSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden max-w-full">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('home.detailedServices.title')} <span className="text-amber-500">{t('home.detailedServices.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('home.detailedServices.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {serviceCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const title = t(`home.detailedServices.cats.${cat.key}.title`) as string;
            const items = t(`home.detailedServices.cats.${cat.key}.items`, { returnObjects: true }) as string[];

            return (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {items && items.length > 0 && items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${cat.color}`} aria-hidden="true" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {cat.slug && (
                  <Link
                    to={`/services/${cat.slug}`}
                    className="pt-4 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold hover:text-amber-700 dark:hover:text-amber-300 transition-colors mt-auto"
                  >
                    <span>{t('serviceDetailPage.heroBadge', 'تصفح التفاصيل الفنية')}</span>
                    <ArrowLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180 group-hover:translate-x-1'}`} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

