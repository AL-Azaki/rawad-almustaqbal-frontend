import { PhoneCall, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { trackWhatsAppClick, trackPhoneCallClick } from '../../lib/analytics';

export default function StickyMobileCTA() {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';

  const defaultPhone = '+966506396004';
  const defaultWhatsApp = '966506396004';

  const phone = settings?.contactPhone || defaultPhone;
  const whatsappNumber = (settings?.whatsappNumber || defaultWhatsApp).replace('+', '');
  
  const whatsappMessage = encodeURIComponent(
    isAr ? 'مرحباً، أود الاستفسار وطلب الخدمة من رواد المستقبل.' : 'Hello, I would like to request a service from Rawad Al-Mustaqbal.'
  );
  
  const waLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const telLink = `tel:${phone}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] animate-fade-in-up [animation-duration:300ms]">
      <a 
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('sticky_mobile_bar')}
        aria-label={isAr ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
        className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-base transition-colors"
      >
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
        <span>{isAr ? 'واتساب الآن' : 'WhatsApp'}</span>
      </a>
      <a 
        href={telLink}
        onClick={() => trackPhoneCallClick('sticky_mobile_bar')}
        aria-label={isAr ? 'اتصل بنا هاتفياً' : 'Call us'}
        className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-gray-900 font-bold text-base transition-colors"
      >
        <PhoneCall className="w-5 h-5" aria-hidden="true" />
        <span>{isAr ? 'اتصل الآن' : 'Call Now'}</span>
      </a>
    </div>
  );
}
