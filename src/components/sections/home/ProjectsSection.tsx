import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../ui/Badge';
import { OptimizedImage } from '../../common/OptimizedImage';

export interface ProjectType {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  video_path?: string | null;
  video_url?: string | null;
  description: string;
  updated_at?: string;
}

interface ProjectsSectionProps {
  projects: ProjectType[];
  loading: boolean;
}

export function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-white dark:bg-gray-900 py-16 overflow-hidden max-w-full transition-colors duration-300">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('home.projects.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t('home.projects.subtitle')}</p>
      </div>
      
      <div className="w-full px-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar [touch-action:pan-y] w-full max-w-7xl mx-auto">
          {loading && projects.length === 0 ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="relative w-72 sm:w-80 h-56 rounded-3xl overflow-hidden shadow-xl shrink-0 snap-center border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-300 dark:bg-gray-700">
                <div className="absolute bottom-5 right-5 w-1/3 h-6 bg-gray-400/50 dark:bg-gray-600 rounded-full mb-3"></div>
                <div className="absolute bottom-5 right-5 w-2/3 h-8 bg-gray-400/50 dark:bg-gray-600 rounded mt-10"></div>
              </div>
            ))
          ) : projects.length === 0 && !loading ? (
            <div className="w-full text-center text-gray-500 dark:text-gray-400 py-10 font-bold">{t('home.projects.empty')}</div>
          ) : (
            projects.map((project, i) => {
              const getImageUrl = (path: string | null) => {
                if (!path) return null;
                if (path.startsWith('http')) return path;
                const cacheBuster = typeof project.updated_at === 'string' ? new Date(project.updated_at).getTime() : project.id;
                if (path.startsWith('/storage')) {
                  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
                  return `${baseUrl}${path}?v=${cacheBuster}`;
                }
                return path;
              };
              const imageUrl = getImageUrl(project.image_path);
              const videoUrl = getImageUrl(project.video_path || project.video_url || null);
              const activeMedia = imageUrl || videoUrl;
              const isVideo = (activeMedia && /\.(mp4|webm|ogg|mov)$/i.test(activeMedia.split('?')[0])) || (!imageUrl && !!videoUrl);

              return (
              <Link to="/portfolio" key={i} className="relative w-72 sm:w-80 h-56 rounded-3xl overflow-hidden shadow-xl shrink-0 snap-center group/card block border border-white/20 dark:border-gray-700">
                <OptimizedImage
                  src={activeMedia}
                  isVideo={isVideo}
                  alt={`${project.title} - ${project.category} في جدة وجميع مناطق المملكة`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 pointer-events-none"
                  fallback={
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" aria-hidden="true" />
                    </div>
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90 pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-right pointer-events-none">
                  <Badge shape="pill" className="!px-3 !py-1 !bg-amber-500/20 backdrop-blur-md !border-amber-500/30 !text-amber-300 !text-xs mb-3 border">
                    {project.category}
                  </Badge>
                  <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{project.title}</h3>
                </div>
              </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

