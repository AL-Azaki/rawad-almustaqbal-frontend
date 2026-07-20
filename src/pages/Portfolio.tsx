import { useState, useEffect } from 'react';
import { Maximize2, MapPin, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ApiClient } from '../lib/api';
import { useSettings } from '../contexts/SettingsContext';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { PORTFOLIO_CATEGORIES } from '../data/portfolioCaseStudies';

interface ProjectType {
  id: number | string;
  slug?: string;
  title: string;
  category: string;
  location_district?: string;
  image_path: string | null;
  video_path?: string | null;
  video_url?: string | null;
  description: string;
}

export default function Portfolio() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>(PORTFOLIO_CATEGORIES[0]);
  
  const [projects, setProjects] = useState<ProjectType[]>(() => {
    const cached = localStorage.getItem('portfolio_projects');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(!projects.length);
  const categories = PORTFOLIO_CATEGORIES;

  useEffect(() => {
    ApiClient.get<any[]>('/projects')
      .then(response => {
        const apiData = response.data || [];
        setProjects(apiData);
        localStorage.setItem('portfolio_projects', JSON.stringify(apiData));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching projects from API:", error);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language]);

  const filteredProjects = activeCategory === PORTFOLIO_CATEGORIES[0] || activeCategory === t('portfolio.all') 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{t('nav.portfolio')} | {settings?.siteName || t('home.title')}</title>
        <meta name="description" content={settings?.siteDescription || t('home.subtitle')} />
        <meta name="keywords" content={t('home.keywords', "معرض أعمال, سابقة أعمال, مشاريع تقنية, مشاريع شبكات, دراسات حالة هندسية, أبحر الشمالية, جدة")} />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('portfolio.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('portfolio.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gray-900 dark:bg-amber-500 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Interactive Before/After Showcase */}
        <div className="mb-16 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-3 border border-amber-500/20">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{isAr ? 'التوثيق الميداني الحي' : 'Live Field Verification'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              {isAr ? 'شاهد جودة التحول الهندسي (قبل وبعد)' : 'Witness Our Architectural Transformation (Before & After)'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
              {isAr
                ? 'مقارنة حقيقية من مشاريعنا المنفذة في الفلل والمباني التجارية بجدة وأبحر الشمالية. اسحب الشريط التفاعلي لرؤية الفرق الميداني.'
                : 'Real comparison from our executed villa and commercial projects in Jeddah and North Obhur. Drag the slider to experience the difference.'}
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200"
            afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
            beforeLabel={isAr ? 'الوضع السابق قبل تدخل رواد المستقبل' : 'Condition Before Future Pioneers Intervention'}
            afterLabel={isAr ? 'النتيجة النهائية والتشطيب الهندسي المتقن' : 'Final Engineered & Organized Result'}
          />
        </div>

        {/* Loading State or Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton State
            [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse h-96 w-full border border-gray-200 dark:border-gray-700"></div>
            ))
          ) : filteredProjects.length === 0 ? (
            // Empty State
            <div className="col-span-full w-full text-center text-gray-500 dark:text-gray-400 py-20 font-bold text-lg bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              {t('portfolio.empty')}
            </div>
          ) : (
            filteredProjects.map((project) => {
              const getImageUrl = (path: string | null) => {
                if (!path) return null;
                if (path.startsWith('http')) return path;
                if (path.startsWith('/storage')) {
                  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
                  return `${baseUrl}${path}`;
                }
                return path;
              };
              const imageUrl = getImageUrl(project.image_path);
              const videoUrl = getImageUrl(project.video_path || project.video_url || null);
              const activeMedia = imageUrl || videoUrl;
              const isVideo = (activeMedia && /\.(mp4|webm|ogg|mov)$/i.test(activeMedia.split('?')[0])) || (!imageUrl && !!videoUrl);
              const targetLink = `/portfolio/${project.slug || project.id}`;
              
              return (
                <Link
                  to={targetLink}
                  key={project.id} 
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer h-96 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-all duration-500 flex flex-col justify-end"
                >
                  <OptimizedImage
                    src={activeMedia}
                    isVideo={isVideo}
                    alt={`${project.title} - ${project.category} ${project.location_district ? `في ${project.location_district}` : 'في جدة وأبحر الشمالية'}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    fallback={
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-medium">
                        {t('portfolio.comingSoon')}
                      </div>
                    }
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col justify-end transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
                        {project.category}
                      </span>
                      {project.location_district && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-gray-300 text-xs font-medium border border-white/10">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-[180px]">{project.location_district}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 text-amber-400 text-sm font-bold pt-2 border-t border-white/10">
                      <span>{isAr ? 'عرض دراسة الحالة والتفاصيل' : 'View Case Study Details'}</span>
                      {isAr ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    </div>
                  </div>

                  {/* View Icon */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <Maximize2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
