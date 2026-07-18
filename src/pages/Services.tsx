import { useState, useEffect } from 'react';
import { Zap, Wifi, Video, Droplet, Lightbulb, PenTool, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ApiClient } from '../lib/api';
import { useSettings } from '../contexts/SettingsContext';

const iconMap: Record<string, React.ReactNode> = {
  'Zap': <Zap className="w-10 h-10 text-amber-500" aria-hidden="true" />,
  'Wifi': <Wifi className="w-10 h-10 text-blue-500" aria-hidden="true" />,
  'Video': <Video className="w-10 h-10 text-red-500" aria-hidden="true" />,
  'Droplet': <Droplet className="w-10 h-10 text-cyan-500" aria-hidden="true" />,
  'Lightbulb': <Lightbulb className="w-10 h-10 text-purple-500" aria-hidden="true" />,
  'PenTool': <PenTool className="w-10 h-10 text-emerald-500" aria-hidden="true" />
};

const colorMap = ['bg-amber-50 dark:bg-amber-900/30', 'bg-blue-50 dark:bg-blue-900/30', 'bg-red-50 dark:bg-red-900/30', 'bg-cyan-50 dark:bg-cyan-900/30', 'bg-purple-50 dark:bg-purple-900/30', 'bg-emerald-50 dark:bg-emerald-900/30'];
const borderMap = ['group-hover:border-amber-500', 'group-hover:border-blue-500', 'group-hover:border-red-500', 'group-hover:border-cyan-500', 'group-hover:border-purple-500', 'group-hover:border-emerald-500'];

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  starting_price: number | null;
}

export default function Services() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';
  
  const [services, setServices] = useState<ServiceType[]>(() => {
    const cached = localStorage.getItem('services_page_data');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!services.length);

  useEffect(() => {
    ApiClient.get<ServiceType[]>('/services', { all: true })
      .then(response => {
        setServices(response.data);
        localStorage.setItem('services_page_data', JSON.stringify(response.data));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching services", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{t('nav.services')} | {settings?.siteName || t('home.title')}</title>
        <meta name="description" content={settings?.siteDescription || t('home.subtitle')} />
        <meta name="keywords" content={t('home.keywords', "الخدمات الكهربائية, كاميرات مراقبة, شبكات, ديكور")} />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('services.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('services.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton State
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-80 animate-pulse border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-6"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))
          ) : services.length === 0 ? (
            // Empty State
            <div className="col-span-full w-full text-center text-gray-500 dark:text-gray-400 py-20 font-bold text-lg bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              لم يتم إضافة خدمات بعد.
            </div>
          ) : (
            services.map((service, index) => (
              <div 
                key={service.id} 
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent ${borderMap[index % borderMap.length]} cursor-pointer flex flex-col h-full`}
              >
                <div className={`w-20 h-20 rounded-2xl ${colorMap[index % colorMap.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon && iconMap[service.icon] ? iconMap[service.icon] : <PenTool className="w-10 h-10 text-gray-500 dark:text-gray-400" aria-hidden="true" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                {service.starting_price && (
                  <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                    {t('services.startFrom')} {service.starting_price} {t('services.currency')}
                  </span>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <Link 
                  to={`/contact?service=${service.title}`}
                  className="mt-auto inline-flex items-center text-amber-600 dark:text-amber-500 font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {t('services.orderNow')}
                  <ArrowLeft className={`w-5 h-5 mx-2 ${isAr ? '' : 'rotate-180'}`} aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">{t('services.ctaTitle')}</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            {t('services.ctaDesc')}
          </p>
          <Link to="/contact" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-full transition-all hover:shadow-lg hover:scale-105 relative z-10">
            {t('services.ctaBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
