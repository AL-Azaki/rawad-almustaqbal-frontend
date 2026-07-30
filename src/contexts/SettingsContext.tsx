import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../lib/api';

interface Settings {
  companyNameAr?: string;
  companyNameEn?: string;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  siteTitle?: string;
  copyrightText?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  facebook: string;
  twitter: string;
  instagram: string;
  snapchat: string;
  tiktok: string;
  theme: string;
  language: string;
  googleBusinessName?: string;
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  googlePlaceId?: string;
  googleLatitude?: string;
  googleLongitude?: string;
  googleEnableReviewButton?: string;
  googleEnableUtmTracking?: string;
  
  // Tracking & Analytics
  googleAnalyticsId?: string;
  googleAnalyticsEnabled?: string;
  gtmId?: string;
  gtmEnabled?: string;
  metaPixelId?: string;
  metaPixelEnabled?: string;
  tiktokPixelId?: string;
  tiktokPixelEnabled?: string;
  snapchatPixelId?: string;
  snapchatPixelEnabled?: string;
  googleSearchConsoleId?: string;
  googleSearchConsoleEnabled?: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await ApiClient.get<{ [key: string]: string }>('/settings');
      
      const defaultSettings = {
        companyNameAr: 'العزكي تك',
        companyNameEn: 'ALAZAKITECH',
        logoUrl: '/logo.jpg',
        faviconUrl: '/favicon.ico',
        ogImageUrl: '/logo.jpg',
        siteTitle: 'العزكي تك | ALAZAKITECH',
        copyrightText: '© ALAZAKITECH. جميع الحقوق محفوظة.',
        siteName: 'العزكي تك',
        siteDescription: 'شركة العزكي تك للحلول التقنية المتكاملة في جدة وجميع مناطق المملكة العربية السعودية. متخصصون في تأسيس المنازل الذكية، كاميرات المراقبة، الشبكات، والصيانة الكهربائية بأعلى جودة وضمان.',
        contactEmail: 'abdoalazaki190@gmail.com',
        contactPhone: '+966 50 639 6004',
        whatsappNumber: '966506396004',
        facebook: 'https://facebook.com/alazakitech',
        twitter: 'https://twitter.com/alazakitech',
        instagram: 'https://instagram.com/alazakitech',
        snapchat: 'https://snapchat.com/add/alazakitech',
        tiktok: 'https://tiktok.com/@alazakitech',
        theme: 'light',
        language: 'ar',
        googleBusinessName: 'العزكي تك للحلول التقنية',
        googleMapsUrl: 'https://maps.google.com/?cid=1234567890',
        googleReviewUrl: 'https://g.page/r/1234567890/review',
        googlePlaceId: 'ChIJxxxxxxxxxxxx',
        googleLatitude: '21.7583',
        googleLongitude: '39.1417',
        googleEnableReviewButton: '1',
        googleEnableUtmTracking: '1'
      };

      const data = { ...defaultSettings, ...(res.data || {}) };
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings({
        companyNameAr: 'العزكي تك',
        companyNameEn: 'ALAZAKITECH',
        logoUrl: '/logo.jpg',
        faviconUrl: '/favicon.ico',
        ogImageUrl: '/logo.jpg',
        siteTitle: 'العزكي تك | ALAZAKITECH',
        copyrightText: '© ALAZAKITECH. جميع الحقوق محفوظة.',
        siteName: 'العزكي تك',
        siteDescription: 'شركة العزكي تك للحلول التقنية المتكاملة في جدة وجميع مناطق المملكة العربية السعودية. متخصصون في تأسيس المنازل الذكية، كاميرات المراقبة، الشبكات، والصيانة الكهربائية بأعلى جودة وضمان.',
        contactEmail: 'abdoalazaki190@gmail.com',
        contactPhone: '+966506396004',
        whatsappNumber: '966506396004',
        facebook: 'https://facebook.com/alazakitech',
        twitter: 'https://twitter.com/alazakitech',
        instagram: 'https://instagram.com/alazakitech',
        snapchat: 'https://snapchat.com/add/alazakitech',
        tiktok: 'https://tiktok.com/@alazakitech',
        theme: 'light',
        language: 'ar',
        googleBusinessName: 'العزكي تك للحلول التقنية',
        googleMapsUrl: 'https://maps.google.com/?cid=1234567890',
        googleReviewUrl: 'https://g.page/r/1234567890/review',
        googlePlaceId: 'ChIJxxxxxxxxxxxx',
        googleLatitude: '21.7583',
        googleLongitude: '39.1417',
        googleEnableReviewButton: '1',
        googleEnableUtmTracking: '1'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
