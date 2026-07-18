import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { useSettings } from '../contexts/SettingsContext';

export default function PublicLayout() {
  const { settings } = useSettings();
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <meta property="og:title" content={settings?.siteName || t('home.title')} />
        <meta property="og:description" content={settings?.siteDescription || t('home.subtitle')} />
        <meta property="twitter:title" content={settings?.siteName || t('home.title')} />
        <meta property="twitter:description" content={settings?.siteDescription || t('home.subtitle')} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "${settings?.siteName || t('home.title')}",
              "description": "${settings?.siteDescription || t('home.subtitle')}",
              "telephone": "${settings?.contactPhone || '+966506396004'}"
            }
          `}
        </script>
      </Helmet>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
