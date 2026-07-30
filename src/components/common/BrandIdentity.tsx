import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';

interface BrandIdentityProps {
  /** Additional classes for the container */
  className?: string;
  /** Custom classes for the logo image (e.g., max-h-12) */
  imageClassName?: string;
  /** Custom classes for the fallback text */
  textClassName?: string;
}

export default function BrandIdentity({
  className = '',
  imageClassName = 'max-h-12 md:max-h-14',
  textClassName = 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300',
}: BrandIdentityProps) {
  const { settings } = useSettings();
  const { i18n } = useTranslation();
  
  const [imageError, setImageError] = useState(false);
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);

  const fallbackTextAr = 'العزكي تك';
  const fallbackTextEn = 'ALAZAKITECH';
  const bundledLogo = '/logo.jpg';

  const companyNameAr = settings?.companyNameAr || fallbackTextAr;
  const companyNameEn = settings?.companyNameEn || fallbackTextEn;
  const companyName = i18n.language === 'en' ? companyNameEn : companyNameAr;

  const customLogo = settings?.logoUrl;
  const currentLogo = customLogo || bundledLogo;
  
  useEffect(() => {
    setImageError(false);
    setUseFallbackLogo(false);
  }, [customLogo]);

  const activeSrc = useFallbackLogo ? bundledLogo : currentLogo;

  const handleImageError = () => {
    // If we haven't tried the fallback logo yet, and the custom logo failed, try the bundled logo.
    if (!useFallbackLogo && customLogo && customLogo !== bundledLogo) {
      setUseFallbackLogo(true);
    } else {
      // If the bundled logo itself failed, show typography fallback.
      setImageError(true);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <img 
          src={activeSrc} 
          srcSet={activeSrc ? `${activeSrc} 1x, ${activeSrc} 2x` : undefined}
          sizes="(max-width: 768px) 48px, 56px"
          alt={companyName}
          className={`object-contain w-auto transition-transform duration-300 ${imageClassName}`}
          onError={handleImageError}
        />
      ) : (
          <div className="flex flex-col justify-center">
            <span className={`text-xl md:text-2xl font-extrabold leading-tight tracking-tight ${textClassName}`}>
              {companyName}
            </span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-blue-600 dark:text-blue-400 uppercase leading-none mt-1 opacity-90">
              {companyNameEn}
            </span>
          </div>
        )}
      </div>
  );
}
