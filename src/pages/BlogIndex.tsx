import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, ArrowLeft, BookOpen, Sparkles, Filter } from 'lucide-react';
import { ApiClient, getImageUrl } from '../lib/api';
import type { BlogPostItem } from '../data/blogPosts';
import { BLOG_POSTS_SSOT } from '../data/blogPosts';
import { useSettings } from '../contexts/SettingsContext';

export default function BlogIndex() {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const siteName = settings?.siteName || 'رواد المستقبل';
  const isAr = i18n.language === 'ar';

  const [posts, setPosts] = useState<BlogPostItem[]>(BLOG_POSTS_SSOT);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await ApiClient.get<any[]>('/blog');
        const items = Array.isArray(res.data) ? res.data : [];
        if (isMounted && items.length > 0) {
          const normalized: BlogPostItem[] = items.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: typeof item.title === 'object' ? item.title : { ar: item.title_ar || item.title, en: item.title_en || item.title },
            excerpt: typeof item.excerpt === 'object' ? item.excerpt : { ar: item.excerpt_ar || item.excerpt || '', en: item.excerpt_en || item.excerpt || '' },
            content: typeof item.content === 'object' ? item.content : { ar: item.content_ar || item.content || '', en: item.content_en || item.content || '' },
            category: typeof item.category === 'object' ? item.category : { ar: item.category_ar || item.category || 'عام', en: item.category_en || item.category || 'General' },
            image_path: item.image_path ? getImageUrl(item.image_path) : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
            reading_time: item.reading_time || 5,
            related_service_slug: item.related_service_slug || 'electrical-services-jeddah',
            author_name: item.author_name || 'مهندسو رواد المستقبل',
            published_at: item.published_at || new Date().toISOString(),
          }));
          setPosts(normalized);
        }
      } catch (err) {
        console.warn('Could not fetch blog posts from API, falling back to SSOT:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const list: { key: string; label: string }[] = [
      { key: 'all', label: isAr ? 'جميع التصنيفات' : 'All Categories' }
    ];
    const seen = new Set<string>();
    posts.forEach((p) => {
      const catKey = p.category.ar;
      if (!seen.has(catKey)) {
        seen.add(catKey);
        list.push({
          key: catKey,
          label: isAr ? p.category.ar : p.category.en || p.category.ar
        });
      }
    });
    return list;
  }, [posts, isAr]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = isAr ? post.title.ar : post.title.en;
      const excerpt = isAr ? post.excerpt.ar : post.excerpt.en;
      const content = isAr ? post.content.ar : post.content.en;
      const category = post.category.ar;

      const matchesSearch =
        !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory, isAr]);

  const pageTitle = isAr
    ? `المدونة والمعرفة الهندسية | ${siteName}`
    : `Engineering Blog & Knowledge Base | ${siteName}`;
  const pageDesc = isAr
    ? 'أدلة هندسية ومقالات متخصصة في أعمال الكهرباء والشبكات وكاميرات المراقبة والسباكة في جدة وأبحر الشمالية، نصائح لحماية منزلك وتوفير الطاقة.'
    : 'Professional engineering guides and technical articles on electrical, structured cabling, CCTV, and plumbing solutions across Jeddah and North Obhur.';

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: pageTitle,
    description: pageDesc,
    url: window.location.href,
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold mb-6 border border-amber-500/20">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" aria-hidden="true" />
            <span>{isAr ? 'مركز المعرفة التقنية المعتمد' : 'Certified Technical Knowledge Center'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {isAr ? 'مقالات وأدلة ' : 'Engineering Guides & '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              {isAr ? 'رواد المستقبل الهندسية' : 'Technical Articles'}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
            {isAr
              ? 'نضع بين يديك خلاصة خبرة مهندسينا الميدانيين في جدة وأبحر الشمالية لمساعدتك في فهم وحل التحديات الكهربائية والشبكية والأمنية في منزلك ومنشأتك.'
              : 'Practical engineering insights, maintenance tips, and field strategies directly from our certified technicians across Jeddah and North Obhur.'}
          </p>
        </div>
      </section>

      {/* Main Content & Filtering Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar & Filters Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                {isAr ? 'التصنيف:' : 'Filter:'}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 shrink-0 ${
                    selectedCategory === cat.key
                      ? 'bg-amber-500 text-gray-950 shadow-md scale-105 font-bold'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Internal Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'البحث الداخلي في المقالات...' : 'Search articles...'}
                className={`w-full py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all ${
                  isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              <Search
                className={`w-4 h-4 text-gray-400 absolute top-3 ${isAr ? 'right-3.5' : 'left-3.5'}`}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {loading && posts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse h-96 w-full border border-gray-200 dark:border-gray-700"></div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {isAr ? 'لم يتم العثور على مقالات مطابقة' : 'No matching articles found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {isAr ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.' : 'Try searching with different keywords or reset the category filter.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-full text-sm transition-all shadow-sm"
              >
                {isAr ? 'عرض جميع المقالات' : 'View All Articles'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const title = isAr ? post.title.ar : post.title.en;
                const excerpt = isAr ? post.excerpt.ar : post.excerpt.en;
                const category = isAr ? post.category.ar : post.category.en;
                return (
                  <article
                    key={post.id}
                    className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={post.image_path}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3.5 py-1.5 rounded-full bg-gray-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-sm">
                            {category}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                            {isAr ? `${post.reading_time} دقائق قراءة` : `${post.reading_time} min read`}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(post.published_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-500 transition-colors leading-snug">
                          <Link to={`/blog/${post.slug}`} className="hover:underline">
                            {title}
                          </Link>
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">
                          {excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer CTA */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 mt-auto">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm group-hover:gap-3 transition-all duration-300"
                      >
                        <span>{isAr ? 'قراءة المقال كاملاً' : 'Read Full Article'}</span>
                        {isAr ? (
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Emergency Bottom Banner */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-900 to-amber-950 py-16 text-white border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            {isAr ? 'هل تواجه مشكلة فنية عاجلة في فيلتك أو منشأتك الآن؟' : 'Facing an Urgent Technical Emergency Right Now?'}
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {isAr
              ? 'فريق الطوارئ والصيانة في رواد المستقبل متاح للنزول الميداني الفوري في جميع أحياء جدة وأبحر الشمالية خلال دقائق.'
              : 'Our rapid emergency response engineers are ready for immediate field dispatch across all Jeddah and North Obhur districts.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-extrabold text-sm md:text-base transition-all shadow-lg hover:shadow-amber-500/25 transform hover:scale-105"
            >
              {isAr ? 'طلب فريق الصيانة الفوري' : 'Request Emergency Dispatch'}
            </Link>
            <Link
              to="/services"
              className="px-8 py-3.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm md:text-base transition-all border border-gray-700"
            >
              {isAr ? 'تصفح خدماتنا الهندسية' : 'Explore Services'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
