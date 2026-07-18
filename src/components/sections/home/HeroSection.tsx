import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../contexts/SettingsContext';
import { Badge } from '../../ui/Badge';

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';

  return (
    <section className="relative py-16 md:pt-32 md:pb-40 overflow-hidden flex items-center justify-center min-h-[85vh]">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000" 
          alt=""
          role="presentation"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover opacity-60 animate-kenburns motion-reduce:animate-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 z-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <Badge 
          shape="pill" 
          className="!py-2 !px-5 !bg-amber-500/20 !text-amber-400 !text-sm mb-6 !border-amber-500/30 backdrop-blur-sm shadow-lg shadow-amber-500/10 animate-fade-in-up border"
        >
          {t('home.badge')}
        </Badge>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
          {settings?.siteName || t('home.title')} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t('home.titleHighlight')}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          {settings?.siteDescription || t('home.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/contact" className="bg-amber-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/50 hover:-translate-y-1 flex items-center justify-center gap-2">
            {t('home.cta')}
            <ArrowLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} aria-hidden="true" />
          </Link>
          <Link to="/services" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md transition-all flex items-center justify-center">
            {t('home.explore')}
          </Link>
        </div>
      </div>
    </section>
  );
}
