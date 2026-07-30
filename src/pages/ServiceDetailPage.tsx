import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  Wifi,
  Video,
  Droplet,
  Lightbulb,
  PenTool,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Award,
  MessageSquare,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { ServiceComparisonTable } from '../components/services/ServiceComparisonTable';
import { FAQSection } from '../components/sections/home/FAQSection';
import { getServicePageBySlug, SERVICE_PAGES_SSOT } from '../data/servicePages';
import { ApiClient } from '../lib/api';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

const SERVICE_BEFORE_AFTER_MAP: Record<
  string,
  { beforeImage: string; afterImage: string; beforeLabelAr: string; beforeLabelEn: string; afterLabelAr: string; afterLabelEn: string }
> = {
  electrical: {
    beforeImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'لوحة كهرباء وتوزيع أحمال تقليدي عشوائي',
    beforeLabelEn: 'Disorganized & Unsafe Conventional Wiring Panel',
    afterLabelAr: 'طبلون وتوزيع كهربائي منظم ومدروس هندسياً من العزكي تك',
    afterLabelEn: 'Engineered & Certified Electrical Distribution Panel by Future Pioneers',
  },
  network: {
    beforeImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'تمديدات شبكات وسيرفرات عشوائية ومكشوفة',
    beforeLabelEn: 'Chaotic & Exposed Server Cabling Setup',
    afterLabelAr: 'كابينة فايبر وشبكات منظمة ومؤرخة باحترافية عالية',
    afterLabelEn: 'Structured, Labeled & High-Speed Fiber Rack Installation',
  },
  surveillance: {
    beforeImage: 'https://images.unsplash.com/photo-1508873696983-2df529a3c882?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'كاميرات مراقبة بأسلاك ظاهرة وزوايا تغطية ناقصة',
    beforeLabelEn: 'Exposed Cabling & Blind-Spot Conventional Camera',
    afterLabelAr: 'نظام مراقبة IP 4K مخفي التمديدات وشامل التغطية الميدانية',
    afterLabelEn: 'Concealed 4K IP Surveillance System with Full Perimeter Coverage',
  },
  plumbing: {
    beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'تمديدات مواسير تقليدية معرضة للكسر والتسربات',
    beforeLabelEn: 'Vulnerable & Leaky Conventional Plumbing Piping',
    afterLabelAr: 'تأسيس حراري معتمد ومختبر بالضغط عالي المتانة والسلامة',
    afterLabelEn: 'Pressure-Tested Thermal Piping System Complying with Codes',
  },
  lighting: {
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'إنارة ساطعة وموزعة بطريقة تسبب الإجهاد البصري',
    beforeLabelEn: 'Harsh Glare & Unbalanced Room Lighting',
    afterLabelAr: 'إنارة معماريّة مخفية وذكية تبرز جمالية وراحة المكان',
    afterLabelEn: 'Architectural Smart Concealed Lighting & Mood Automation',
  },
  interior: {
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    beforeLabelAr: 'هيكل خام وتمديدات غير معالجة قبل تدخل العزكي تك',
    beforeLabelEn: 'Raw Structural Shell & Unfinished Interiors',
    afterLabelAr: 'تشطيب ديكور داخلي فاخر ومطابق للمخطط الهندسي المعتمد',
    afterLabelEn: 'Luxury Architectural Interior Finish Complying with Blueprint',
  },
};

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-12 h-12 text-amber-500" aria-hidden="true" />,
  Wifi: <Wifi className="w-12 h-12 text-amber-500" aria-hidden="true" />,
  Video: <Video className="w-12 h-12 text-amber-500" aria-hidden="true" />,
  Droplet: <Droplet className="w-12 h-12 text-amber-500" aria-hidden="true" />,
  Lightbulb: <Lightbulb className="w-12 h-12 text-amber-500" aria-hidden="true" />,
  PenTool: <PenTool className="w-12 h-12 text-amber-500" aria-hidden="true" />,
};

interface ApiServiceData {
  id: number;
  title: string;
  slug?: string;
  category?: string;
  description: string;
  icon?: string;
  starting_price?: string | number;
}

interface ProjectType {
  id: number | string;
  slug?: string;
  title: string;
  category: string;
  image_path: string | null;
}

export const ServiceDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const ssotData = getServicePageBySlug(slug);
  const [apiData, setApiData] = useState<ApiServiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(!ssotData);
  const [relatedProjects, setRelatedProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    ApiClient.get<ApiServiceData>(`/services/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res?.data) {
          setApiData(res.data);
          
          // Fetch related projects
          ApiClient.get<ProjectType[]>('/projects').then(pRes => {
            const allProjects = pRes.data || [];
            const filtered = allProjects.filter(p => p.category === res.data.category || p.category === ssotData?.id);
            setRelatedProjects(filtered.slice(0, 3)); // show top 3
          }).catch(err => console.error("Error fetching projects", err));
        }
      })
      .catch((err) => {
        console.debug('Service not found in API, relying on SSOT dataset:', err?.message);
        // Try fetching projects based on SSOT category
        if (ssotData) {
          ApiClient.get<ProjectType[]>('/projects').then(pRes => {
            const allProjects = pRes.data || [];
            const filtered = allProjects.filter(p => p.category === ssotData.id);
            setRelatedProjects(filtered.slice(0, 3));
          }).catch(e => console.error(e));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading && !ssotData && !apiData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {isAr ? 'جاري تحميل تفاصيل الخدمة...' : 'Loading service details...'}
          </p>
        </div>
      </div>
    );
  }

  // Determine active display properties
  const activeIconKey = ssotData?.iconName || apiData?.icon || 'Wrench';
  const iconNode = iconMap[activeIconKey] || <Wrench className="w-12 h-12 text-amber-500" aria-hidden="true" />;

  const titleText =
    ssotData && t(`home.detailedServices.cats.${ssotData.id}.title`) !== `home.detailedServices.cats.${ssotData.id}.title`
      ? t(`home.detailedServices.cats.${ssotData.id}.title`)
      : apiData?.title || (isAr ? 'خدمة هندسية متخصصة' : 'Specialized Engineering Service');

  const descText =
    ssotData && t(`home.detailedServices.cats.${ssotData.id}.items.0`) !== `home.detailedServices.cats.${ssotData.id}.items.0`
      ? (t(`home.detailedServices.cats.${ssotData.id}.items`, { returnObjects: true }) as string[]).join(' • ')
      : apiData?.description || t('serviceDetailPage.whyChooseSubtitle');

  const startingPrice = ssotData
    ? isAr
      ? ssotData.startingPriceAr
      : ssotData.startingPriceEn
    : apiData?.starting_price
    ? `${apiData.starting_price} ${isAr ? 'ريال' : 'SAR'}`
    : isAr
    ? 'حسب المعاينة الميدانية ومساحة المشروع'
    : 'Based on on-site inspection and project area';

  const serviceIdOrTitle = apiData?.id ? String(apiData.id) : ssotData?.id || titleText;

  // SEO Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: titleText,
    description: descText,
    provider: {
      '@type': 'LocalBusiness',
      name: isAr ? 'العزكي تك' : 'Future Pioneers Contracting & Technical Solutions',
      address: {
        '@type': 'PostalAddress',
        addressLocality: isAr ? 'جدة' : 'Jeddah',
        addressRegion: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions',
        addressCountry: 'SA',
      },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: isAr ? 'جدة' : 'Jeddah' },
      { '@type': 'AdministrativeArea', name: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions' },
      { '@type': 'AdministrativeArea', name: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions' },
    ],
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-20">
      {/* Helmet SEO Tags */}
      <Helmet>
        <title>{`${titleText} | ${isAr ? 'العزكي تك - جدة وجميع مناطق المملكة' : 'Future Pioneers - Jeddah & All Saudi Arabia Regions'}`}</title>
        <meta name="description" content={descText} />
        <meta
          name="keywords"
          content={`${titleText}, ${isAr ? 'جدة, جميع مناطق المملكة, جميع مناطق المملكة, العزكي تك, مقاولات جدة, صيانة منازل جميع مناطق المملكة' : 'Jeddah, All Saudi Arabia Regions, All Saudi Arabia Regions, Future Pioneers, Contracting Jeddah'}`}
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-b from-amber-50/50 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            className="mb-8"
            items={[
              { name: t('serviceDetailPage.breadcrumbHome', 'الرئيسية'), url: '/' },
              { name: t('serviceDetailPage.breadcrumbServices', 'الخدمات'), url: '/services' },
              { name: titleText }
            ]} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 text-right rtl:text-right ltr:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-6 border border-amber-500/20">
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t('serviceDetailPage.heroBadge', 'خدمة تخصصية معتمدة 🌟')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                {titleText}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {descText}
              </p>

              {/* Price & Quick Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Award className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {t('serviceDetailPage.startingPriceLabel', 'السعر المبدئي:')}
                    </span>
                    <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                      {startingPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to={`/contact?service=${encodeURIComponent(serviceIdOrTitle)}`}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-3 text-base"
                >
                  <span>{t('serviceDetailPage.orderServiceBtn', 'طلب هذه الخدمة الآن')}</span>
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </Link>

                <a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 text-base"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  <span>{t('serviceDetailPage.whatsappInquireBtn', 'استشارة فنية عبر الواتساب')}</span>
                </a>
              </div>
            </div>

            {/* Icon Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:to-gray-800 flex items-center justify-center border border-amber-500/20 shadow-2xl relative group hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative z-10">{iconNode}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Why Choose All Saudi Arabia Regions & North Jeddah Section */}
        <section className="py-16 my-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('serviceDetailPage.whyChooseTitle', 'لماذا يفضل سكان جدة وجميع مناطق المملكة')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                {t('serviceDetailPage.whyChooseHighlight', 'تنفيذ هذه الخدمة معنا؟')}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('serviceDetailPage.whyChooseSubtitle', 'خبرة ميدانية تمتد لسنوات في أحياء جدة وجميع مناطق المملكة، مع فهم عميق لاحتياجات الفلل السكنية والمباني التجارية.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/40 transition-all text-right rtl:text-right ltr:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('serviceDetailPage.benefit1Title', 'استجابة ميدانية فورية في جميع مناطق المملكة والشمال')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t('serviceDetailPage.benefit1Desc', 'لتواجد فرقنا الدائم في أحياء الشراع، الياقوت، اللؤلؤ، والزمرد، نصل لموقعك للمعاينة والبدء السريع في قياسي وقت.')}
              </p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/40 transition-all text-right rtl:text-right ltr:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('serviceDetailPage.benefit2Title', 'مواد أصلية معتمدة وضمان 24 شهراً')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t('serviceDetailPage.benefit2Desc', 'لا نستخدم إلا أفضل الماركات العالمية والمطابقة للمواصفات السعودية مع تسليم شهادة ضمان ذهبي مكتوبة وملزمة.')}
              </p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/40 transition-all text-right rtl:text-right ltr:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('serviceDetailPage.benefit3Title', 'إشراف هندسي وتنفيذ متقن بدون تشويه')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t('serviceDetailPage.benefit3Desc', 'نراعي أعلى معايير الجمالية في التشطيب وإخفاء التمديدات والكابلات بأحدث الأدوات والتقنيات النظيفة.')}
              </p>
            </div>
          </div>
        </section>

        {/* Technical Comparison Table Component */}
        <ServiceComparisonTable />

        {/* Interactive Before & After Field Showcase Section */}
        {(() => {
          const serviceKey = ssotData?.id || 'electrical';
          const baData = SERVICE_BEFORE_AFTER_MAP[serviceKey] || SERVICE_BEFORE_AFTER_MAP.electrical;
          return (
            <section className="py-16 my-8 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-4 border border-amber-500/20">
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{isAr ? 'المقارنة البصرية الميدانية' : 'Visual Field Verification'}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                  {isAr ? 'شاهد الفرق الميداني (قبل وبعد تنفيذ هذه الخدمة)' : 'Visual Difference (Before & After Our Engineering Execution)'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                  {isAr
                    ? 'اسحب المقبض التفاعلي أدناه لمقارنة جودة وكفاءة العمل بين الأساليب العشوائية القديمة واحترافية مهندسي العزكي تك.'
                    : 'Drag the interactive slider below to compare conventional hazardous methods against Future Pioneers certified engineering craftsmanship.'}
                </p>
              </div>

              <BeforeAfterSlider
                beforeImage={baData.beforeImage}
                afterImage={baData.afterImage}
                beforeLabel={isAr ? baData.beforeLabelAr : baData.beforeLabelEn}
                afterLabel={isAr ? baData.afterLabelAr : baData.afterLabelEn}
                beforeAlt={isAr ? baData.beforeLabelAr : baData.beforeLabelEn}
                afterAlt={isAr ? baData.afterLabelAr : baData.afterLabelEn}
              />
            </section>
          );
        })()}

        {/* Related Services Links */}
        <section className="py-16 my-8 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              {t('serviceDetailPage.relatedServicesTitle', 'خدمات وحلول ذات صلة')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {t('serviceDetailPage.relatedServicesSubtitle', 'اكتشف الخدمات التكاملية التي يطلبها عملاؤنا مع هذه الخدمة لتجهيز منشأتهم بالكامل.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(ssotData?.relatedCategoryKeys || ['electrical', 'network', 'surveillance']).map((relKey) => {
              const relPage = SERVICE_PAGES_SSOT.find((p) => p.id === relKey);
              if (!relPage || relPage.id === ssotData?.id) return null;
              const relTitle = t(`home.detailedServices.cats.${relPage.id}.title`);
              return (
                <Link
                  key={relPage.id}
                  to={`/services/${relPage.slug}`}
                  className="p-6 bg-gray-50 dark:bg-gray-800/50 hover:bg-amber-50/50 dark:hover:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors text-right rtl:text-right ltr:text-left">
                    {relTitle}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Related Projects Links */}
        {relatedProjects.length > 0 && (
          <section className="py-16 my-8 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                {isAr ? 'مشاريع منفذة ذات صلة' : 'Related Executed Projects'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {isAr ? 'تصفح بعض أعمالنا المرتبطة بهذه الخدمة' : 'Browse some of our works related to this service'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 block"
                >
                  {project.image_path ? (
                    <img src={project.image_path.startsWith('http') ? project.image_path : (project.image_path.startsWith('/storage') ? `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '')}${project.image_path}` : project.image_path)} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400">بدون صورة</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-600 transition-colors">
                <span>{isAr ? 'عرض كافة المشاريع' : 'View all projects'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection />

        {/* Bottom CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>

          <h2 className="text-2xl md:text-4xl font-bold mb-4 relative z-10">{titleText}</h2>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            {isAr
              ? 'هل تحتاج لعرض سعر هندسي أو معاينة ميدانية لمشروعك في جدة أو جميع مناطق المملكة؟ تواصل معنا الآن وسيقوم فريقنا الميداني بالاستجابة الفورية.'
              : 'Need an engineering quotation or on-site inspection for your project in Jeddah or All Saudi Arabia Regions? Contact us now for rapid dispatch.'}
          </p>

          <Link
            to={`/contact?service=${encodeURIComponent(serviceIdOrTitle)}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all text-base relative z-10"
          >
            <span>{t('serviceDetailPage.orderServiceBtn', 'طلب هذه الخدمة الآن')}</span>
            {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

