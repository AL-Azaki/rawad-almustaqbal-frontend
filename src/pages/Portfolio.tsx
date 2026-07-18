import { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ApiClient } from '../lib/api';
import { useSettings } from '../contexts/SettingsContext';

interface ProjectType {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
}

export default function Portfolio() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [activeCategory, setActiveCategory] = useState(t('portfolio.all'));
  
  const [projects, setProjects] = useState<ProjectType[]>(() => {
    const cached = localStorage.getItem('portfolio_projects');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!projects.length);
  const [categories, setCategories] = useState<string[]>([t('portfolio.all')]);

  useEffect(() => {
    // If we have cached projects, set categories instantly
    if (projects.length > 0) {
      const uniqueCats = Array.from(new Set(projects.map(p => p.category))) as string[];
      setCategories([t('portfolio.all'), ...uniqueCats]);
    }

    ApiClient.get<ProjectType[]>('/projects')
      .then(response => {
        setProjects(response.data);
        localStorage.setItem('portfolio_projects', JSON.stringify(response.data));
        const uniqueCats = Array.from(new Set(response.data.map(p => p.category))) as string[];
        setCategories([t('portfolio.all'), ...uniqueCats]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching projects", error);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const filteredProjects = activeCategory === t('portfolio.all') 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{t('nav.portfolio')} | {settings?.siteName || t('home.title')}</title>
        <meta name="description" content={settings?.siteDescription || t('home.subtitle')} />
        <meta name="keywords" content={t('home.keywords', "معرض أعمال, سابقة أعمال, مشاريع تقنية, مشاريع شبكات")} />
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

        {/* Loading State or Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton State
            [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse h-80 w-full border border-gray-200 dark:border-gray-700"></div>
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
              const isVideo = imageUrl && /\.(mp4|webm|ogg|mov)$/i.test(imageUrl.split('?')[0]);
              
              return (
                <div 
                  key={project.id} 
                  className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer h-80 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800"
                >
                  {/* Image or Video */}
                  {imageUrl ? (
                    isVideo ? (
                      <video 
                        src={imageUrl} 
                        controls 
                        playsInline 
                        className="w-full h-full object-contain bg-black"
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <img 
                        src={imageUrl} 
                        alt={project.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    )
                  ) : null}
                  
                  {/* Fallback View */}
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium ${imageUrl ? 'hidden' : 'flex'}`}>
                    {t('portfolio.comingSoon')}
                  </div>
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <span className="text-amber-400 font-medium text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                      {project.description}
                    </p>
                  </div>

                  {/* View Icon */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
