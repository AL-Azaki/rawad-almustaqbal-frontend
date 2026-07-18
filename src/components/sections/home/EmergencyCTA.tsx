import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../contexts/SettingsContext';

export function EmergencyCTA() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <section className="py-20 bg-gray-900 dark:bg-black text-white text-center transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">{t('home.emergencyTitle')}</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">{t('home.emergencyDesc')}</p>
        <a href={`https://wa.me/${(settings?.whatsappNumber || '966506396004').replace('+', '')}`} target="_blank" rel="noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all">
          {t('home.emergencyBtn')}
        </a>
      </div>
    </section>
  );
}
