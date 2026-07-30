import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  Wrench,
  Sparkles,
  Target,
  Eye,
  Compass,
  Users,
  Clock,
  Layers,
  HeartHandshake,
  Briefcase,
  Zap,
} from 'lucide-react';

export default function About() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageTitle = t('about.title');
  const pageDesc = t('about.desc');
  const pageKeywords = t('about.keywords');

  // Schema.org Structured Data
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: pageTitle,
    description: pageDesc,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: isAr ? 'العزكي تك' : 'Future Pioneers Contracting & Technical Solutions',
      foundingDate: '2012',
      description: pageDesc,
      address: {
        '@type': 'PostalAddress',
        addressLocality: isAr ? 'جدة' : 'Jeddah',
        addressRegion: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions',
        addressCountry: 'SA',
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: isAr ? 'جدة' : 'Jeddah' },
        { '@type': 'AdministrativeArea', name: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions' },
        { '@type': 'AdministrativeArea', name: isAr ? 'جميع مناطق المملكة' : 'All Saudi Arabia Regions' },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: window.location.origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('nav.about'),
        item: `${window.location.origin}/about`,
      },
    ],
  };

  // Lists from translation dictionaries
  const philosophyItems = (t('about.philosophy.items', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];
  const whyChooseUsItems = (t('about.whyChooseUs.items', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];
  const methodologySteps = (t('about.methodology.steps', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];

  const whyChooseIcons = [Clock, Award, Layers, HeartHandshake];
  const philosophyIcons = [Compass, Zap, Eye];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pb-20">
      {/* Helmet SEO & Social Metadata */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify(aboutPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-b from-amber-50/60 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{t('nav.about')}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-6 border border-amber-500/20 shadow-sm">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t('about.hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* 2. About the Company Section */}
        <section className="py-16 my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-right rtl:text-right ltr:text-left">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider block mb-2">
                {t('about.aboutCompany.title')}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                {t('about.aboutCompany.titleHighlight')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {t('about.aboutCompany.p1')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t('about.aboutCompany.p2')}
              </p>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-8 bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:to-gray-800 rounded-3xl border border-amber-500/20 shadow-2xl relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                  <Briefcase className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {isAr ? 'خبرة عملية منذ 2012' : 'Experience Built Since 2012'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {isAr
                    ? 'تراكم مستمر للخبرات في تنفيذ المشاريع التقنية والكهربائية المتكاملة بأعلى درجات الانضباط الميداني.'
                    : 'Continuous experience built through executing integrated technical and electrical projects with highest field discipline.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. Our Vision & Mission */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 md:p-10 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Eye className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {t('about.vision.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {t('about.vision.desc')}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Target className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {t('about.mission.desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Our Engineering Philosophy */}
        <section className="py-16 my-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('about.philosophy.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('about.philosophy.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(philosophyItems) &&
              philosophyItems.map((item, idx) => {
                const IconComp = philosophyIcons[idx % philosophyIcons.length];
                return (
                  <div
                    key={idx}
                    className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-right rtl:text-right ltr:text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                      <IconComp className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
          </div>
        </section>

        {/* 6. Why Clients Choose Us */}
        <section className="py-16 my-8 bg-gray-50 dark:bg-gray-800/40 rounded-3xl p-8 md:p-14 border border-gray-200/60 dark:border-gray-700/60">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('about.whyChooseUs.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('about.whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(whyChooseUsItems) &&
              whyChooseUsItems.map((item, idx) => {
                const IconComp = whyChooseIcons[idx % whyChooseIcons.length];
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-amber-500/50 transition-all text-right rtl:text-right ltr:text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
                        <IconComp className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* 7. Our Work Methodology */}
        <section className="py-16 my-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('about.methodology.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('about.methodology.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {Array.isArray(methodologySteps) &&
              methodologySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between text-right rtl:text-right ltr:text-left"
                >
                  <div className="absolute top-6 left-6 rtl:left-6 ltr:right-6 rtl:right-auto text-4xl font-black text-amber-500/20 dark:text-amber-500/10 select-none">
                    0{idx + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base mb-6 shadow-md shadow-amber-500/20">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 8 & 9. Commitment to Quality & Commitment to Safety */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 md:p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {t('about.quality.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {t('about.quality.desc')}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <ShieldCheck className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {t('about.safety.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {t('about.safety.desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 10. Specialized Engineering & Technical Team */}
        <section className="py-16 my-8 bg-gradient-to-tr from-amber-500/5 via-gray-50 to-white dark:from-gray-800/60 dark:via-gray-800/30 dark:to-gray-900 rounded-3xl p-8 md:p-14 border border-gray-200/80 dark:border-gray-700/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 text-right rtl:text-right ltr:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Users className="w-7 h-7" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                {t('about.team.title')}
              </h2>
              <p className="text-base md:text-lg text-amber-600 dark:text-amber-400 font-semibold mb-6">
                {t('about.team.subtitle')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                {t('about.team.desc')}
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-xl relative">
                <Wrench className="w-20 h-20 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* 11. CTA Banner */}
        <section className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>

          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 relative z-10">{t('about.cta.title')}</h2>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
            {t('about.cta.subtitle')}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all text-base relative z-10"
          >
            <span>{t('about.cta.btn')}</span>
            {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </section>
      </div>
    </div>
  );
}

