import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Calendar,
  User,
  Share2,
  Check,
  ArrowRight,
  ArrowLeft,
  List,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { ApiClient, getImageUrl } from '../lib/api';
import type { BlogPostItem } from '../data/blogPosts';
import { getBlogPostBySlug, BLOG_POSTS_SSOT } from '../data/blogPosts';
import { useSettings } from '../contexts/SettingsContext';

interface TocItem {
  id: string;
  level: number;
  text: string;
}

export default function BlogArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const siteName = settings?.siteName || 'العزكي تك';
  const whatsappNumber = settings?.whatsappNumber || '966506396004';
  const isAr = i18n.language === 'ar';

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await ApiClient.get<any>(`/blog/${slug}`);
        const responseData = res.data;
        if (isMounted && responseData && responseData.post) {
          const item = responseData.post;
          const normalizedPost: BlogPostItem = {
            id: item.id,
            slug: item.slug,
            title: typeof item.title === 'object' ? item.title : { ar: item.title_ar || item.title, en: item.title_en || item.title },
            excerpt: typeof item.excerpt === 'object' ? item.excerpt : { ar: item.excerpt_ar || item.excerpt || '', en: item.excerpt_en || item.excerpt || '' },
            content: typeof item.content === 'object' ? item.content : { ar: item.content_ar || item.content || '', en: item.content_en || item.content || '' },
            category: typeof item.category === 'object' ? item.category : { ar: item.category_ar || item.category || 'عام', en: item.category_en || item.category || 'General' },
            image_path: item.image_path ? getImageUrl(item.image_path) : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
            reading_time: item.reading_time || 5,
            related_service_slug: item.related_service_slug || 'electrical-services-jeddah',
            author_name: item.author_name || 'مهندسو العزكي تك',
            published_at: item.published_at || new Date().toISOString(),
          };
          setPost(normalizedPost);

          if (Array.isArray(responseData.related_posts) && responseData.related_posts.length > 0) {
            const normalizedRelated = responseData.related_posts.map((rItem: any) => ({
              id: rItem.id,
              slug: rItem.slug,
              title: typeof rItem.title === 'object' ? rItem.title : { ar: rItem.title_ar || rItem.title, en: rItem.title_en || rItem.title },
              excerpt: typeof rItem.excerpt === 'object' ? rItem.excerpt : { ar: rItem.excerpt_ar || rItem.excerpt || '', en: rItem.excerpt_en || rItem.excerpt || '' },
              content: typeof rItem.content === 'object' ? rItem.content : { ar: rItem.content_ar || rItem.content || '', en: rItem.content_en || rItem.content || '' },
              category: typeof rItem.category === 'object' ? rItem.category : { ar: rItem.category_ar || rItem.category || 'عام', en: rItem.category_en || rItem.category || 'General' },
              image_path: rItem.image_path ? getImageUrl(rItem.image_path) : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
              reading_time: rItem.reading_time || 5,
              related_service_slug: rItem.related_service_slug || 'electrical-services-jeddah',
              author_name: rItem.author_name || 'مهندسو العزكي تك',
              published_at: rItem.published_at || new Date().toISOString(),
            }));
            setRelatedPosts(normalizedRelated);
          } else {
            const fallbackRelated = BLOG_POSTS_SSOT.filter(
              (item) => item.slug !== normalizedPost.slug && item.category.ar === normalizedPost.category.ar
            ).slice(0, 3);
            setRelatedPosts(fallbackRelated.length > 0 ? fallbackRelated : BLOG_POSTS_SSOT.filter((item) => item.slug !== normalizedPost.slug).slice(0, 3));
          }
        } else {
          const fallbackPost = getBlogPostBySlug(slug);
          if (fallbackPost && isMounted) {
            setPost(fallbackPost);
            const fallbackRelated = BLOG_POSTS_SSOT.filter(
              (item) => item.slug !== fallbackPost.slug && item.category.ar === fallbackPost.category.ar
            ).slice(0, 3);
            setRelatedPosts(fallbackRelated.length > 0 ? fallbackRelated : BLOG_POSTS_SSOT.filter((item) => item.slug !== fallbackPost.slug).slice(0, 3));
          }
        }
      } catch (err) {
        console.warn('Could not load blog post from API, using SSOT:', err);
        const fallbackPost = getBlogPostBySlug(slug);
        if (fallbackPost && isMounted) {
          setPost(fallbackPost);
          const fallbackRelated = BLOG_POSTS_SSOT.filter(
            (item) => item.slug !== fallbackPost.slug && item.category.ar === fallbackPost.category.ar
          ).slice(0, 3);
          setRelatedPosts(fallbackRelated.length > 0 ? fallbackRelated : BLOG_POSTS_SSOT.filter((item) => item.slug !== fallbackPost.slug).slice(0, 3));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const { toc, htmlContent } = useMemo(() => {
    if (!post) return { toc: [], htmlContent: '' };
    const rawContent = isAr ? post.content.ar : post.content.en;

    const tocList: TocItem[] = [];
    let headingCounter = 0;

    const parsed = rawContent.replace(/^(#{2,3})\s+(.+)$/gm, (_match, hashes, text) => {
      headingCounter++;
      const level = hashes.length;
      const cleanText = text.trim();
      const id = `heading-${headingCounter}`;
      tocList.push({ id, level, text: cleanText });

      const sizeClasses = level === 2
        ? 'text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-10 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800'
        : 'text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4';

      return `<h${level} id="${id}" class="${sizeClasses} scroll-mt-28">${cleanText}</h${level}>`;
    });

    const lines = parsed.split('\n');
    let inList = false;
    const formattedLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<h2') || trimmed.startsWith('<h3')) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(line);
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          formattedLines.push(`<ul class="list-disc ${isAr ? 'mr-6' : 'ml-6'} my-4 space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">`);
          inList = true;
        }
        formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else if (trimmed.length > 0) {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(`<p class="my-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">${trimmed}</p>`);
      }
    });

    if (inList) formattedLines.push('</ul>');

    return { toc: tocList, htmlContent: formattedLines.join('\n') };
  }, [post, isAr]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-32 text-center px-4">
        <Helmet>
          <title>{isAr ? 'المقال غير موجود' : 'Article Not Found'}</title>
        </Helmet>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          {isAr ? 'عذراً، هذا المقال غير موجود' : 'Sorry, this article could not be found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isAr ? 'ربما تم نقل المقال أو حذفه. يمكنك العودة لصفحة المدونة وتصفح المقالات المتاحة.' : 'The article might have been moved. Return to the blog directory to explore available guides.'}
        </p>
        <Link
          to="/blog"
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-full text-base transition-all"
        >
          {isAr ? 'العودة للمدونة الهندسية' : 'Back to Engineering Blog'}
        </Link>
      </div>
    );
  }

  const title = isAr ? post.title.ar : post.title.en;
  const excerpt = isAr ? post.excerpt.ar : post.excerpt.en;
  const category = isAr ? post.category.ar : post.category.en;
  const currentUrl = window.location.href;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: [post.image_path],
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-24">
      <Helmet>
        <title>{`${title} | ${siteName}`}</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Article Header / Breadcrumb Hero */}
      <section className="bg-gray-900 text-white py-16 relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-amber-400 transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-amber-400 transition-colors">
              {isAr ? 'المدونة الهندسية' : 'Engineering Blog'}
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">{category}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 mb-4">
              {category}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight md:leading-tight mb-6">
              {title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span className="font-semibold">{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>
                  {new Date(post.published_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>{isAr ? `${post.reading_time} دقائق قراءة` : `${post.reading_time} min read`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Container: Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Content Column (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden mb-10 bg-gray-100 dark:bg-gray-800 shadow-lg border border-gray-200/80 dark:border-gray-700/80">
              <img
                src={post.image_path}
                alt={title}
                className="w-full h-80 md:h-[420px] object-cover"
              />
            </div>

            {/* Mobile/Tablet Table of Contents Widget (< lg) */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-10 bg-amber-500/5 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-lg mb-4">
                  <List className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{isAr ? 'فهرس محتويات المقال التفاعلي' : 'Table of Contents'}</span>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {toc.map((item) => (
                    <li
                      key={item.id}
                      className={`${item.level === 3 ? (isAr ? 'mr-4' : 'ml-4') : 'font-bold'}`}
                    >
                      <a
                        href={`#${item.id}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors py-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rendered HTML Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Quick Share Bar */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-base">
                <Share2 className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <span>{isAr ? 'شارك هذا المقال الهندسي مع أصدقائك:' : 'Share this technical article:'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${currentUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 border border-[#25D366]/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                {/* Twitter / X Share */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 border border-blue-500/30"
                >
                  <span>X / Twitter</span>
                </a>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-gray-700 dark:text-gray-300 font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 border border-gray-200 dark:border-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols): Sticky Table of Contents + High Conversion CTA Card */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sticky Table of Contents (Desktop >= lg) */}
            {toc.length > 0 && (
              <div className="hidden lg:block bg-gray-50 dark:bg-gray-800/60 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-lg mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <List className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{isAr ? 'فهرس محتويات المقال' : 'Table of Contents'}</span>
                </div>
                <nav>
                  <ul className="space-y-2.5 text-sm">
                    {toc.map((item) => (
                      <li
                        key={item.id}
                        className={`${item.level === 3 ? (isAr ? 'mr-4 text-xs' : 'ml-4 text-xs') : 'font-bold'}`}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors py-1 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-amber-500 transition-colors shrink-0" />
                          <span className="leading-snug">{item.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* High Conversion Service Request Card (بطاقة تحويل ثابتة لطلب الخدمة المتعلقة بالمقال) */}
            <div className="bg-gradient-to-br from-gray-900 to-amber-950 p-7 rounded-3xl text-white border border-amber-500/30 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold mb-4 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{isAr ? 'الخدمة الهندسية ذات الصلة' : 'Related Engineering Service'}</span>
              </div>

              <h3 className="text-xl font-extrabold mb-3 leading-snug">
                {isAr
                  ? 'هل تحتاج فحصاً ميدانياً أو صيانة متخصصة لمعالجة هذا الخلل في منشأتك؟'
                  : 'Need Professional Field Verification or Specialized Maintenance?'}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {isAr
                  ? 'مهندسو وفنيو العزكي تك مجهزون بأحدث أجهزة الفحص المعتمدة للنزول الميداني الفوري في جدة وجميع مناطق المملكة بضمان هندسي كامل.'
                  : 'Our certified engineers provide comprehensive diagnostic audits and permanent execution complying with Saudi Building Codes across Jeddah.'}
              </p>

              <div className="space-y-3">
                <Link
                  to={`/contact?service=${post.related_service_slug}`}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{isAr ? 'طلب فحص ميداني فوري الآن' : 'Request Immediate Field Audit'}</span>
                </Link>

                <Link
                  to={`/services/${post.related_service_slug}`}
                  className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>{isAr ? 'تفاصيل الخدمة والأسعار' : 'Service Details & Pricing'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>

              {whatsappNumber && (
                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      isAr ? `مرحباً، قرأت مقال (${title}) وأرغب في استشارة هندسية سريعة.` : `Hello, I read the article (${title}) and need quick engineering advice.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-300 hover:text-amber-400 underline font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>{isAr ? 'أو تحدث مع مهندس استشاري عبر واتساب مباشرة' : 'Or chat directly with an engineer via WhatsApp'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Trust Badges Widget */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {isAr ? 'ضمان هندسي معتمد' : 'Certified Engineering Warranty'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {isAr ? 'جميع أعمالنا مطابقة للكود السعودي (SBC) ومشفوعة بضمانات كتابية.' : 'All executions comply with Saudi Building Code (SBC) with written guarantees.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Grid Section (`قسم مقالات ذات صلة`) */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{isAr ? 'استمر في القراءة والتعلم' : 'Continue Reading'}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {isAr ? 'مقالات وأدلة هندسية ذات صلة' : 'Related Engineering Guides'}
                </h2>
              </div>
              <Link
                to="/blog"
                className="px-6 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-gray-700 dark:text-gray-300 font-bold text-sm transition-all"
              >
                {isAr ? 'تصفح كافة المقالات' : 'View All Guides'}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => {
                const rTitle = isAr ? rPost.title.ar : rPost.title.en;
                const rExcerpt = isAr ? rPost.excerpt.ar : rPost.excerpt.en;
                const rCategory = isAr ? rPost.category.ar : rPost.category.en;
                return (
                  <article
                    key={rPost.id}
                    className="group bg-white dark:bg-gray-800/80 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={rPost.image_path}
                          alt={rTitle}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-950/80 text-amber-400 text-xs font-bold backdrop-blur-md">
                          {rCategory}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isAr ? `${rPost.reading_time} دقائق قراءة` : `${rPost.reading_time} min read`}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-500 transition-colors mb-2">
                          <Link to={`/blog/${rPost.slug}`}>{rTitle}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {rExcerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 mt-auto">
                      <Link
                        to={`/blog/${rPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs group-hover:underline"
                      >
                        <span>{isAr ? 'قراءة المزيد' : 'Read More'}</span>
                        {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

