import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, MessageCircle, Send, Ghost, User, Wrench, AlignLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';
import { ApiClient } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import LocationAutocompleteField from '../components/common/LocationAutocompleteField';
import { trackOrderSubmit, trackWhatsAppClick, trackPhoneCallClick } from '../lib/analytics';

interface ServiceType {
  id: number;
  title: string;
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    service: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [servicesList, setServicesList] = useState<ServiceType[]>(() => {
    const cached = localStorage.getItem('contact_services_data');
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    // Check if there is a service selected from the query params
    const searchParams = new URLSearchParams(window.location.search);
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }

    // Fetch services for the dropdown
    ApiClient.get<ServiceType[]>('/services', { all: true })
      .then(res => {
        setServicesList(res.data);
        localStorage.setItem('contact_services_data', JSON.stringify(res.data));
        if (serviceParam && isNaN(Number(serviceParam))) {
          const matched = res.data.find(
            s => s.title.toLowerCase() === serviceParam.toLowerCase() || (s as any).slug?.toLowerCase() === serviceParam.toLowerCase()
          );
          if (matched) {
            setFormData(prev => ({ ...prev, service: String(matched.id) }));
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const orderData = {
      customer_name: formData.name,
      phone: formData.phone,
      location: formData.location,
      service_id: formData.service,
      description: formData.description
    };

    ApiClient.post('/orders', orderData)
      .then(() => {
        setSuccess(true);
        const selectedService = servicesList.find(s => String(s.id) === formData.service);
        const serviceName = selectedService ? selectedService.title : (isNaN(Number(formData.service)) ? formData.service : 'Unknown');
        trackOrderSubmit(serviceName, formData.location);
        setFormData({ name: '', phone: '', location: '', service: '', description: '' });
      })
      .catch(err => {
        console.error(err);
        if (err.code === 'ECONNABORTED') {
          setError('تأخر الخادم في الاستجابة. يرجى التحقق من اتصال الإنترنت.');
        } else if (!err.response) {
          setError('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً.');
        } else {
          setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل عبر الواتساب.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>{t('nav.contact')} | {settings?.siteName || t('home.title')}</title>
        <meta name="description" content={settings?.siteDescription || t('contact.subtitle')} />
        <meta name="keywords" content={t('home.keywords', "تواصل معنا, صيانة منزلية")} />
      </Helmet>
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-800/50 shadow-sm">
            ⚡ {isAr ? 'خدمة سريعة ومضمونة' : 'Fast & Guaranteed Service'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            {t('contact.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">{t('contact.titleHighlight')}</span> {t('contact.titleAfter')}
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Main Form Container - Primary Focus */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 dark:border-gray-700/80 transition-all duration-300">

            {success ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 p-8 md:p-10 rounded-3xl text-center shadow-lg border border-green-100 dark:border-green-800/50 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/50 dark:bg-green-700/20 rounded-full blur-3xl -mr-10 -mt-10" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/50 dark:bg-emerald-700/20 rounded-full blur-2xl -ml-10 -mb-10" aria-hidden="true"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white dark:bg-green-800 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-green-50 dark:border-green-900">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-green-800 dark:text-green-300 tracking-tight">تم استلام طلبك بنجاح! 🚀</h3>

                  <div className="space-y-4 text-gray-700 dark:text-gray-200 text-lg leading-relaxed font-medium text-right md:text-center">
                    <p>أهلاً بك في عائلة <span className="text-amber-600 dark:text-amber-400 font-bold">{settings?.siteName || 'رواد المستقبل'}</span>.</p>
                    <p>لقد وصل طلبك بأمان إلى فريقنا المختص، ونحن نوليه <strong className="text-green-700 dark:text-green-400">أولوية قصوى</strong>. سيقوم أحد المهندسين أو الفنيين المختصين بدراسة تفاصيل طلبك والتواصل معك في أسرع وقت ممكن (عادةً خلال وقت قصير جداً).</p>

                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm p-5 rounded-2xl mt-6 border border-white/50 dark:border-white/5 shadow-sm text-center">
                      <p className="text-base text-gray-800 dark:text-gray-300">
                        نحن نقدر ثقتك الغالية بنا، ونعدك بتقديم خدمة <strong className="text-amber-600 dark:text-amber-400">احترافية ومضمونة ترضيك 100%</strong>.<br />
                        <span className="inline-block mt-2 font-bold text-green-700 dark:text-green-400">لا داعي للبحث بعيداً.. الحل المضمون صار بين أيدينا! 🛠️✨</span>
                      </p>
                    </div>
                  </div>

                  <Button onClick={() => setSuccess(false)} className="mt-8 px-8 py-3 w-full md:w-auto flex items-center justify-center gap-2 mx-auto rounded-full font-bold shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    تقديم طلب جديد
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl relative flex items-center gap-3 shadow-sm" role="alert">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center shrink-0" aria-hidden="true">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </div>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Customer Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-700/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0" aria-hidden="true">
                          <User className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
                          {isAr ? 'معلومات العميل' : 'Customer Information'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      <div>
                          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('contact.formName')} <span className="text-red-500">*</span>
                          </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <User className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <Input 
                            id="contact-name"
                            type="text" 
                            name="name"
                            required
                            minLength={3}
                            value={formData.name}
                            onChange={handleChange}
                              className="!w-full !pr-12 !pl-4 !bg-gray-50 dark:!bg-gray-700/60 focus:!bg-white dark:focus:!bg-gray-800 transition-all rounded-xl"
                            placeholder="الاسم الثلاثي..."
                          />
                        </div>
                      </div>

                      <div>
                          <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('contact.formPhone')} <span className="text-red-500">*</span>
                          </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Phone className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <Input 
                            id="contact-phone"
                            type="tel" 
                            name="phone"
                            required
                            pattern="^05[0-9]{8}$"
                            title="يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
                            value={formData.phone}
                            onChange={handleChange}
                            dir="ltr"
                              className="!w-full !pr-12 !pl-4 text-right !bg-gray-50 dark:!bg-gray-700/60 focus:!bg-white dark:focus:!bg-gray-800 transition-all rounded-xl"
                            placeholder="05X XXX XXXX"
                          />
                        </div>
                          <p className="text-xs text-gray-500 mt-1.5">مثال: 0501234567</p>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Service Information */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-700/60">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0" aria-hidden="true">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
                          {isAr ? 'معلومات الخدمة والموقع' : 'Service Information'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      <div>
                          <label htmlFor="contact-service" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('contact.formService')} <span className="text-red-500">*</span>
                          </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Wrench className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <select 
                            id="contact-service"
                            name="service"
                            required
                            value={formData.service}
                            onChange={handleChange}
                              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm appearance-none"
                          >
                            <option value="" disabled>{t('contact.formServiceSelect')}</option>
                            {servicesList.map((s, i) => <option key={i} value={s.id}>{s.title}</option>)}
                            {formData.service && isNaN(Number(formData.service)) && (
                              <option value={formData.service}>{formData.service}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <LocationAutocompleteField 
                        value={formData.location} 
                        onChange={(val) => setFormData(prev => ({ ...prev, location: val }))} 
                      />
                    </div>
                    </div>

                    {/* Section 3: Request Details */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-700/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0" aria-hidden="true">
                          <AlignLeft className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
                          {isAr ? 'تفاصيل الطلب' : 'Request Details'}
                        </h3>
                      </div>

                      <div className="pt-1">
                        <label htmlFor="contact-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {t('contact.formDesc')} <span className="text-red-500">*</span>
                        </label>
                      <div className="relative group">
                          <div className="absolute top-3.5 right-4 flex items-start pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <AlignLeft className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <Textarea 
                          id="contact-description"
                          name="description"
                          required
                          minLength={10}
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                            className="!w-full !pr-12 !pl-4 !bg-gray-50 dark:!bg-gray-700/60 focus:!bg-white dark:focus:!bg-gray-800 transition-all rounded-xl resize-none"
                          placeholder="يرجى كتابة تفاصيل المشكلة أو الطلب بدقة لتسهيل خدمتك..."
                        />
                      </div>
                    </div>
                    </div>

                    {/* Primary CTA - Dominant Button */}
                    <div className="pt-4 space-y-4">
                    <Button 
                      type="submit" 
                      loading={loading}
                      fullWidth
                        className="py-4.5 rounded-2xl flex items-center justify-center gap-3 group font-extrabold text-lg md:text-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200"
                    >
                      {!loading && (
                        <>
                          <span>{t('contact.formSubmit')}</span>
                            <Send className={`w-5 h-5 transition-transform duration-300 ${isAr ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`} aria-hidden="true" />
                        </>
                      )}
                    </Button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {t('trust.response')}
                      </span>
                      <span className="hidden sm:inline-block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                      <span className="flex items-center gap-1.5">
                        🛡️ {t('trust.secure')}
                      </span>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Quick Contact Section - Positioned Below Submission Button */}

        </div>
      </div>
    </div>
  );
}

