import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../lib/api';

interface Settings {
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
        siteName: 'رواد المستقبل',
        siteDescription: 'نحن نوصل إلى كل شبر أو حي داخل جدة في أي مكان، فقط أرسل الموقع.',
        contactEmail: 'abdoalazaki190@gmail.com',
        contactPhone: '+966 50 639 6004',
        whatsappNumber: '966506396004',
        facebook: 'https://facebook.com/Jeddahtechnician',
        twitter: '',
        instagram: 'https://instagram.com/jeddah_technician',
        snapchat: 'https://www.snapchat.com/add/blzky2021',
        tiktok: '',
        theme: 'light',
        language: 'ar'
      };

      const data = { ...defaultSettings, ...(res.data || {}) };
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings({
        siteName: 'رواد المستقبل',
        siteDescription: 'نحن نوصل إلى كل شبر أو حي داخل جدة في أي مكان، فقط أرسل الموقع.',
        contactEmail: 'abdoalazaki190@gmail.com',
        contactPhone: '+966506396004',
        whatsappNumber: '966506396004',
        facebook: 'https://facebook.com/Jeddahtechnician',
        twitter: '',
        instagram: 'https://instagram.com/jeddah_technician',
        snapchat: 'https://www.snapchat.com/add/blzky2021',
        tiktok: '',
        theme: 'light',
        language: 'ar'
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
