import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';
import { trackCaseStudyView } from '../lib/analytics';
import { ApiClient } from '../lib/api';
import { type CaseStudyItem } from '../data/portfolioCaseStudies';
import { UniversalVideoPlayer } from '../components/common/UniversalVideoPlayer';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Wrench,
  Sparkles,
  Layers,
  Image as ImageIcon,
  AlertCircle,
  PhoneCall,
} from 'lucide-react';

interface ApiProjectResponse {
  id: number;
  title: string;
  slug?: string;
  category: string;
  location_district?: string;
  description: string;
  challenge_solution_text?: string;
  duration?: string;
  installed_equipment?: string[] | Array<{ ar?: string; en?: string; [key: string]: any }>;
  image_path?: string | null;
  video_url?: string | null;
  video_path?: string | null;
  before_image_path?: string | null;
  after_image_path?: string | null;
}

export default function CaseStudyDetailPage() {
  const { id: slugOrId } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [caseStudy, setCaseStudy] = useState<CaseStudyItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slugOrId) {
      setLoading(false);
      return;
    }

    ApiClient.get<ApiProjectResponse>(`/projects/${slugOrId}`)
      .then((res) => {
        const p = res.data;
        if (p) {
          const getImgUrl = (path: string | null | undefined) => {
            if (!path) return '';
            if (path.startsWith('http')) return path;
            if (path.startsWith('/storage')) {
              const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
              return `${baseUrl}${path}`;
            }
            return path;
          };

          const parseEquipment = (eq: any): Array<{ ar: string; en: string }> => {
            if (!eq) return [];
            if (Array.isArray(eq)) {
              return eq.map((item) => {
                if (typeof item === 'string') return { ar: item, en: item };
                if (typeof item === 'object' && item !== null) {
                  return {
                    ar: item.ar || item.title || item.name || JSON.stringify(item),
                    en: item.en || item.title || item.name || JSON.stringify(item),
                  };
                }
                return { ar: String(item), en: String(item) };
              });
            }
            return [];
          };

          // Parse challenge vs solution text if combined
          const parseChallengeSolution = (text?: string) => {
            if (!text) return { challenge: p.description || '', solution: '' };
            if (text.includes('### التحدي الفني') && text.includes('### الحل الهندسي')) {
              const parts = text.split('### الحل الهندسي');
              const ch = parts[0]
                .replace('### التحدي الفني والوضع السابق للموقع:', '')
                .replace('### التحدي الفني:', '')
                .trim();
              const so = parts[1]
                ? parts[1]
                    .replace('والمنهجية المتبعة:', '')
                    .replace('ومن منهجية العمل:', '')
                    .replace('ومنهجية العمل:', '')
                    .replace(':', '')
                    .trim()
                : '';
              return { challenge: ch, solution: so };
            }
            return { challenge: text, solution: '' };
          };

          const { challenge: parsedChallenge, solution: parsedSolution } = parseChallengeSolution(p.challenge_solution_text);

          const newCaseStudy: CaseStudyItem = {
            id: p.id,
            slug: p.slug || String(p.id),
            title: { ar: p.title, en: p.title },
            category: { ar: p.category, en: p.category },
            location_district: {
              ar: p.location_district || 'أبحر الشمالية، جدة',
              en: p.location_district || 'North Obhur, Jeddah',
            },
            duration: {
              ar: p.duration || '3 أسابيع عمل',
              en: p.duration || '3 Weeks Execution',
            },
            description: { ar: p.description || '', en: p.description || '' },
            challenge: { ar: parsedChallenge, en: parsedChallenge },
            solution: { ar: parsedSolution || parsedChallenge, en: parsedSolution || parsedChallenge },
            installed_equipment: parseEquipment(p.installed_equipment),
            results: {
              ar: 'تنفيذ احترافي ومطابق لمعايير الجودة والسلامة وبكفاءة تشغيلية 100%.',
              en: 'Professional execution complying with safety standards and 100% operational reliability.',
            },
            image_path: getImgUrl(p.image_path),
            video_url: getImgUrl(p.video_url) || undefined,
            video_path: getImgUrl(p.video_path) || undefined,
            before_image_path: getImgUrl(p.before_image_path) || undefined,
            after_image_path: getImgUrl(p.after_image_path) || undefined,
          };

          setCaseStudy(newCaseStudy);
          trackCaseStudyView(p.id, p.title);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API fetch error for project:', err);
        setLoading(false);
      });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{t('common.loading', 'جاري تحميل دراسة الحالة الهندسية...')}</p>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20 container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {isAr ? 'دراسة الحالة غير متوفرة' : 'Case Study Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {isAr
              ? 'المشروع أو دراسة الحالة التي تبحث عنها غير موجودة في سجلاتنا، أو تم تحديث رابط المشروع.'
              : 'The project or architectural case study you are looking for does not exist or its link has changed.'}
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all"
          >
            {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            <span>{isAr ? 'العودة لمعرض الأعمال' : 'Back to Portfolio'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = isAr ? caseStudy.title.ar : caseStudy.title.en;
  const category = isAr ? caseStudy.category.ar : caseStudy.category.en;
  const locationDistrict = isAr ? caseStudy.location_district.ar : caseStudy.location_district.en;
  const duration = isAr ? caseStudy.duration.ar : caseStudy.duration.en;
  const description = isAr ? caseStudy.description.ar : caseStudy.description.en;
  const challengeText = isAr ? caseStudy.challenge.ar : caseStudy.challenge.en;
  const solutionText = isAr ? caseStudy.solution.ar : caseStudy.solution.en;
  const resultsText = isAr ? caseStudy.results.ar : caseStudy.results.en;

  const pageTitle = `${title} | ${settings?.siteName || t('home.title')}`;
  const pageDesc = `${category} - ${locationDistrict} - ${description.slice(0, 150)}...`;

  // Schema.org Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    image: caseStudy.image_path ? [caseStudy.image_path] : [],
    datePublished: '2026-01-15T08:00:00+03:00',
    dateModified: '2026-07-19T10:00:00+03:00',
    author: {
      '@type': 'Organization',
      name: isAr ? 'رواد المستقبل للمقاولات والحلول التقنية' : 'Future Pioneers Contracting & Technical Solutions',
    },
    publisher: {
      '@type': 'Organization',
      name: isAr ? 'رواد المستقبل للمقاولات والحلول التقنية' : 'Future Pioneers Contracting & Technical Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
      },
    },
    spatialCoverage: {
      '@type': 'Place',
      name: locationDistrict,
      address: {
        '@type': 'PostalAddress',
        addressLocality: isAr ? 'جدة' : 'Jeddah',
        addressRegion: isAr ? 'أبحر الشمالية' : 'North Obhur',
        addressCountry: 'SA',
      },
    },
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-24">
      {/* SEO & Social Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={`${category}, ${locationDistrict}, دراسة حالة هندسية, مشاريع رواد المستقبل, صيانة تقنية`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={caseStudy.image_path} />
        <meta property="og:url" content={`${window.location.origin}/portfolio/${caseStudy.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={caseStudy.image_path} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Hero Header Section */}
      <section className="relative pt-28 pb-16 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-800 text-white overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" aria-hidden="true"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            className="mb-8"
            items={[
              { name: t('nav.home'), url: '/' },
              { name: t('nav.portfolio'), url: '/portfolio' },
              { name: title }
            ]} 
          />

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold border border-amber-500/30">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{category}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-gray-200 text-sm font-medium border border-white/15">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{locationDistrict}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-gray-200 text-sm font-medium border border-white/15">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{duration}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl">
            {description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl mt-12">
        {/* Main Featured Image or Video */}
        {(caseStudy.video_path || caseStudy.video_url || caseStudy.image_path) && (
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 mb-12 bg-gray-100 dark:bg-gray-800 max-h-[600px]">
            {caseStudy.video_path || caseStudy.video_url ? (
              <UniversalVideoPlayer
                videoPath={caseStudy.video_path}
                videoUrl={caseStudy.video_url}
                poster={caseStudy.image_path}
              />
            ) : (
              caseStudy.image_path && (
                <img
                  src={caseStudy.image_path}
                  alt={title}
                  loading="eager"
                  className="w-full h-full object-cover max-h-[600px]"
                />
              )
            )}
          </div>
        )}

        {/* Project Metrics Overview Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 text-right rtl:text-right ltr:text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                {isAr ? 'المنطقة والحي' : 'Location District'}
              </h3>
              <p className="text-base font-bold text-gray-900 dark:text-white">{locationDistrict}</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 text-right rtl:text-right ltr:text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                {isAr ? 'مدة التنفيذ والإنجاز' : 'Execution Duration'}
              </h3>
              <p className="text-base font-bold text-gray-900 dark:text-white">{duration}</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 text-right rtl:text-right ltr:text-left flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                {isAr ? 'حالة الاعتماد والفحص' : 'Compliance & Status'}
              </h3>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'مكتمل ومجتاز للكود' : 'Completed & Certified'}</span>
              </p>
            </div>
          </div>
        </section>

        {/* 1. Technical Challenge Section */}
        <section className="mb-14 p-8 sm:p-10 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm text-right rtl:text-right ltr:text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isAr ? 'التحدي الفني والوضع السابق للموقع' : 'The Technical Challenge & Site Condition'}
            </h2>
          </div>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed space-y-4">
            <p>{challengeText}</p>
          </div>
        </section>

        {/* 2. Engineered Solution & Execution Steps */}
        <section className="mb-14 p-8 sm:p-10 bg-gradient-to-tr from-amber-500/5 via-gray-50 to-white dark:from-gray-800/80 dark:via-gray-800/40 dark:to-gray-800 rounded-3xl border border-amber-500/20 dark:border-gray-700 shadow-sm text-right rtl:text-right ltr:text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isAr ? 'الحل الهندسي المنفذ ومنهجية العمل' : 'The Engineered Solution & Work Methodology'}
            </h2>
          </div>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed space-y-4">
            <p>{solutionText}</p>
          </div>
        </section>

        {/* 3. Installed Equipment & Cabling List Table/Grid */}
        {caseStudy.installed_equipment && caseStudy.installed_equipment.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6 text-right rtl:text-right ltr:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {isAr ? 'قائمة الأجهزة والكابلات والمواصفات المعتمدة' : 'Installed Equipment & Cabling Specifications'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.installed_equipment.map((item, idx) => {
                const itemText = isAr ? item.ar : item.en;
                return (
                  <div
                    key={idx}
                    className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex items-center gap-4 hover:border-amber-500/40 transition-colors text-right rtl:text-right ltr:text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-base leading-relaxed">
                      {itemText}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Before & After Comparison / Media Gallery */}
        {(caseStudy.before_image_path || caseStudy.after_image_path) && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6 text-right rtl:text-right ltr:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {isAr ? 'التوثيق الميداني (قبل وبعد التنفيذ)' : 'Field Verification (Before & After)'}
              </h2>
            </div>

            {caseStudy.before_image_path && caseStudy.after_image_path ? (
              <BeforeAfterSlider
                beforeImage={caseStudy.before_image_path}
                afterImage={caseStudy.after_image_path}
                beforeAlt="Condition Before Future Pioneers Intervention"
                afterAlt="Final Engineered & Organized Result"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {caseStudy.before_image_path && (
                  <div className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-4 py-2 text-sm border-b border-red-500/20 text-center">
                      {isAr ? 'الوضع السابق قبل تدخل رواد المستقبل' : 'Condition Before Future Pioneers Intervention'}
                    </div>
                    <img
                      src={caseStudy.before_image_path}
                      alt="Before condition"
                      loading="lazy"
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                  </div>
                )}
                {caseStudy.after_image_path && (
                  <div className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-4 py-2 text-sm border-b border-emerald-500/20 text-center">
                      {isAr ? 'النتيجة النهائية والتشطيب الهندسي المتقن' : 'Final Engineered & Organized Result'}
                    </div>
                    <img
                      src={caseStudy.after_image_path}
                      alt="After completion"
                      loading="lazy"
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* 5. Measurable Outcomes & Results */}
        <section className="mb-16 p-8 bg-amber-500/10 dark:bg-amber-500/15 rounded-3xl border border-amber-500/30 text-right rtl:text-right ltr:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'المخرجات والنتائج المكتسبة للعميل' : 'Achieved Project Outcomes & Value'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {resultsText}
            </p>
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl pointer-events-none" aria-hidden="true"></div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 relative z-10">
            {isAr
              ? `هل لديك فيلا أو مشروع مشابه في ${locationDistrict}؟`
              : `Have a Similar Villa or Project in ${locationDistrict}?`}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
            {isAr
              ? 'تواصل مع فريق مهندسي رواد المستقبل الآن لطلب معاينة ميدانية فنية ووضع خطة هندسية دقيقة تضمن حماية ممتلكاتك وبنيتك التحتية.'
              : 'Contact Future Pioneers engineering team right now for an on-site technical inspection and tailored infrastructure engineering plan.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all text-base"
            >
              <span>{isAr ? 'اطلب معاينة أو استشارة هندسية' : 'Request On-Site Inspection'}</span>
              {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Link>
            <a
              href="tel:+966500000000"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 text-base"
            >
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <span>{isAr ? 'اتصل بخدمة الطوارئ' : 'Call Emergency Support'}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
