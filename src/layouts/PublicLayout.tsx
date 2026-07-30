import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import StickyMobileCTA from '../components/common/StickyMobileCTA';
import { useSettings } from '../contexts/SettingsContext';
import TrackingScripts from '../components/marketing/TrackingScripts';

export default function PublicLayout() {
  const { settings } = useSettings();
  const { t } = useTranslation();

  const sameAsUrls = [
    settings?.facebook,
    settings?.twitter,
    settings?.instagram,
    settings?.snapchat,
    settings?.tiktok,
  ].filter(Boolean) as string[];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "Electrician"],
    "name": settings?.siteName || t('home.title') || "العزكي تك",
    "description": settings?.siteDescription || t('home.subtitle') || "شركة العزكي تك المتكاملة في جدة وجميع مناطق المملكة وأحياء شمال جدة. متخصصون في تأسيس المنازل الذكية، كاميرات المراقبة، الشبكات، والصيانة الكهربائية بأعلى جودة وضمان.",
    "url": typeof window !== 'undefined' ? window.location.origin : "https://ruwad-almustaqbal.sa",
    "telephone": settings?.contactPhone || "+966506396004",
    "email": settings?.contactEmail || "abdoalazaki190@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "طريق الملك سعود، جميع مناطق المملكة",
      "addressLocality": "جدة",
      "addressRegion": "مكة المكرمة",
      "postalCode": "23815",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.7708,
      "longitude": 39.1265
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Jeddah"
      },
      {
        "@type": "AdministrativeArea",
        "name": "All Saudi Arabia Regions"
      },
      {
        "@type": "AdministrativeArea",
        "name": "All Saudi Arabia Regions"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Yaqout"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Amwaj"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Marjan"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Shati"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Muhammadiyah"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Basateen"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Al Zahraa"
      }

    ],
    ...(sameAsUrls.length > 0 ? { "sameAs": sameAsUrls } : {}),
    ...(settings?.logoUrl ? { "logo": settings.logoUrl, "image": settings.logoUrl } : {})
  };

  return (
    <div className="flex flex-col min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 overflow-x-clip max-w-full">
      <Helmet>
        <meta property="og:title" content={settings?.siteName || t('home.title')} />
        <meta property="og:description" content={settings?.siteDescription || t('home.subtitle')} />
        {settings?.logoUrl && <meta property="og:image" content={settings.logoUrl} />}
        {settings?.siteName && <meta property="og:site_name" content={settings.siteName} />}
        <meta property="twitter:title" content={settings?.siteName || t('home.title')} />
        <meta property="twitter:description" content={settings?.siteDescription || t('home.subtitle')} />
        {settings?.logoUrl && <meta name="twitter:image" content={settings.logoUrl} />}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <TrackingScripts />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <StickyMobileCTA />
    </div>
  );
}

