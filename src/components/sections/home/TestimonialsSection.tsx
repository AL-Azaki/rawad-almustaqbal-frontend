import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../ui/Button';

export interface TestimonialType {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialType[];
  loading: boolean;
  onOpenModal: () => void;
}

export function TestimonialsSection({ testimonials, loading, onOpenModal }: TestimonialsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/80 transition-colors duration-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-start">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('home.testimonials.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('home.testimonials.subtitle')}</p>
          </div>
          <Button 
            onClick={onOpenModal}
            variant="primary"
            className="rounded-full px-6 py-3 font-bold hover:-translate-y-1 shadow-lg"
            leftIcon={<MessageSquarePlus className="w-5 h-5" aria-hidden="true" />}
          >
            {t('home.testimonials.addBtn')}
          </Button>
        </div>
        
        <div className="w-full relative">
          {/* Background decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"></div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar w-full max-w-7xl mx-auto px-4 relative z-10">
            {loading ? (
              // Skeleton Testimonials
              [...Array(3)].map((_, i) => (
                <div key={i} className="w-72 sm:w-80 md:w-96 p-8 rounded-3xl shrink-0 snap-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md animate-pulse h-64 border border-gray-100 dark:border-gray-700 shadow-sm"></div>
              ))
            ) : testimonials.length === 0 ? (
              <div className="w-full text-center text-gray-500 dark:text-gray-400 py-12 font-bold text-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                {t('home.testimonials.empty')}
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-72 sm:w-80 md:w-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 shrink-0 snap-center relative flex flex-col transition-all duration-300 hover:-translate-y-2 group">
                  <Quote className="absolute top-6 left-6 w-16 h-16 text-amber-500/10 dark:text-amber-400/5 rotate-180 z-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <div className="relative z-10 flex-grow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} aria-hidden="true" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('home.testimonials.verified')}</span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-8 text-lg leading-loose font-medium">"{testimonial.text}"</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-2xl shadow-md ring-4 ring-white dark:ring-gray-800">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{testimonial.role || 'عميل مميز'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
