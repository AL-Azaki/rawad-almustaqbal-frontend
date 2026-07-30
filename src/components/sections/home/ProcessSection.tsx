import { PhoneCall, Search, Settings, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProcessSection() {
  const { t } = useTranslation();

  const steps = [
    { title: t('home.howWeWork.steps.s1.title'), desc: t('home.howWeWork.steps.s1.desc'), icon: PhoneCall, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-white dark:bg-gray-800', border: 'border-blue-100 dark:border-blue-900/50', hover: 'hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/50' },
    { title: t('home.howWeWork.steps.s2.title'), desc: t('home.howWeWork.steps.s2.desc'), icon: Search, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-white dark:bg-gray-800', border: 'border-amber-100 dark:border-amber-900/50', hover: 'hover:shadow-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/50' },
    { title: t('home.howWeWork.steps.s3.title'), desc: t('home.howWeWork.steps.s3.desc'), icon: Settings, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-white dark:bg-gray-800', border: 'border-emerald-100 dark:border-emerald-900/50', hover: 'hover:shadow-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/50' },
    { title: t('home.howWeWork.steps.s4.title'), desc: t('home.howWeWork.steps.s4.desc'), icon: ShieldCheck, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-white dark:bg-gray-800', border: 'border-purple-100 dark:border-purple-900/50', hover: 'hover:shadow-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500/50' }
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50/50 to-transparent dark:from-amber-900/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-900/5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-3 block">{t('home.howWeWork.subtitle')}</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">{t('home.howWeWork.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('home.howWeWork.desc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative max-w-7xl mx-auto">
          {/* Animated Dashed Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-gray-200 dark:border-gray-700 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              {/* Step Number Badge */}
              <div className={`absolute top-0 right-1/2 translate-x-[60%] -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold shadow-lg z-20 border-4 border-white dark:border-gray-900 transition-transform duration-300 group-hover:scale-110`}>
                {index + 1}
              </div>
              
              {/* Icon Container */}
              <div className={`w-24 h-24 rounded-full ${step.bg} ${step.color} border-4 ${step.border} flex items-center justify-center mb-8 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${step.hover} relative bg-white dark:bg-gray-800 z-10`}>
                <step.icon className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
              </div>
              
              {/* Content */}
              <div className={`bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 w-full flex-grow transition-all duration-300 shadow-sm ${step.hover}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

