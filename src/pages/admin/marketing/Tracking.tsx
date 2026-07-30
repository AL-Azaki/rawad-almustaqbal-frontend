import { useState, useEffect } from 'react';
import { Save, LineChart, HelpCircle, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../../contexts/SettingsContext';
import { ApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Loader } from '../../../components/ui/Loader';
import { Modal } from '../../../components/ui/Modal';

interface TrackerInfo {
  id: string;
  label: string;
  placeholder: string;
  desc: string;
  recommendation: string;
  regex: RegExp;
  errorMsg: string;
  helpSteps: string[];
}

export default function Tracking() {
  const { settings, refreshSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [activeHelp, setActiveHelp] = useState<TrackerInfo | null>(null);

  const [formData, setFormData] = useState({
    googleAnalyticsId: '',
    googleAnalyticsEnabled: '0',
    gtmId: '',
    gtmEnabled: '0',
    metaPixelId: '',
    metaPixelEnabled: '0',
    tiktokPixelId: '',
    tiktokPixelEnabled: '0',
    snapchatPixelId: '',
    snapchatPixelEnabled: '0',
    googleSearchConsoleId: '',
    googleSearchConsoleEnabled: '0',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        googleAnalyticsId: settings.googleAnalyticsId || '',
        googleAnalyticsEnabled: settings.googleAnalyticsEnabled || '0',
        gtmId: settings.gtmId || '',
        gtmEnabled: settings.gtmEnabled || '0',
        metaPixelId: settings.metaPixelId || '',
        metaPixelEnabled: settings.metaPixelEnabled || '0',
        tiktokPixelId: settings.tiktokPixelId || '',
        tiktokPixelEnabled: settings.tiktokPixelEnabled || '0',
        snapchatPixelId: settings.snapchatPixelId || '',
        snapchatPixelEnabled: settings.snapchatPixelEnabled || '0',
        googleSearchConsoleId: settings.googleSearchConsoleId || '',
        googleSearchConsoleEnabled: settings.googleSearchConsoleEnabled || '0',
      });
    }
  }, [settings]);

  const trackers: TrackerInfo[] = [
    { 
      id: 'googleAnalytics', 
      label: 'Google Analytics (GA4)', 
      placeholder: 'G-XXXXXXXXXX',
      desc: 'لمعرفة عدد زوار موقعك ومن أين يأتون.',
      recommendation: '⭐ موصى به',
      regex: /^G-[A-Z0-9]+$/,
      errorMsg: 'يجب أن يبدأ المعرف بحرف G- متبوعاً بأرقام وحروف',
      helpSteps: [
        'افتح حسابك في Google Analytics.',
        'اذهب إلى قسم "المسؤول" (Admin).',
        'اختر "مصادر البيانات" (Data Streams) ثم اختر موقعك.',
        'انسخ "معرف القياس" (Measurement ID) الذي يبدأ بـ G-.'
      ]
    },
    { 
      id: 'gtm', 
      label: 'Google Tag Manager', 
      placeholder: 'GTM-XXXXXXX',
      desc: 'لإدارة أكواد التتبع المتقدمة بسهولة.',
      recommendation: 'متقدم',
      regex: /^GTM-[A-Z0-9]+$/,
      errorMsg: 'يجب أن يبدأ المعرف بحروف GTM-',
      helpSteps: [
        'افتح حسابك في Google Tag Manager.',
        'في لوحة التحكم الرئيسية، ستجد كوداً يبدأ بـ GTM- بجوار اسم الحاوية.',
        'قم بنسخ هذا المعرف بالكامل.'
      ]
    },
    { 
      id: 'metaPixel', 
      label: 'Meta Pixel', 
      placeholder: '123456789012345',
      desc: 'لتتبع زوار موقعك القادمين من فيسبوك وانستقرام.',
      recommendation: '⭐ موصى به للإعلانات',
      regex: /^\d{15,16}$/,
      errorMsg: 'يجب أن يتكون المعرف من 15 أو 16 رقماً فقط',
      helpSteps: [
        'افتح مدير الأحداث (Events Manager) في حساب فيسبوك الإعلاني.',
        'في القائمة الجانبية، اختر "مصادر البيانات" (Data Sources).',
        'اختر البيكسل الخاص بك.',
        'انسخ "رقم تعريف البيكسل" (Pixel ID) المكون من أرقام.'
      ]
    },
    { 
      id: 'tiktokPixel', 
      label: 'TikTok Pixel', 
      placeholder: 'CDX123456789',
      desc: 'لتتبع نتائج إعلاناتك على تيك توك.',
      recommendation: 'موصى به للإعلانات',
      regex: /^[A-Z0-9]{15,30}$/i,
      errorMsg: 'يجب إدخال معرف TikTok Pixel الصحيح (أحرف وأرقام)',
      helpSteps: [
        'افتح مدير إعلانات TikTok.',
        'من القائمة العلوية، اختر Assets ثم Events.',
        'اختر Web Events.',
        'انسخ معرف البيكسل (ID) من تفاصيل البيكسل الخاص بك.'
      ]
    },
    { 
      id: 'snapchatPixel', 
      label: 'Snapchat Pixel', 
      placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      desc: 'لتتبع نتائج إعلاناتك على سناب شات.',
      recommendation: 'موصى به للإعلانات',
      regex: /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i,
      errorMsg: 'يجب أن يكون المعرف بتنسيق صحيح يحتوي على شُرط (مثال: xxxxxxxx-xxxx-...)',
      helpSteps: [
        'افتح مدير إعلانات Snapchat.',
        'من قائمة Events Manager، اختر Pixels.',
        'اختر البيكسل الخاص بك وانسخ "Pixel ID".'
      ]
    },
    { 
      id: 'googleSearchConsole', 
      label: 'Google Search Console', 
      placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      desc: 'لإثبات ملكيتك للموقع في محركات بحث جوجل.',
      recommendation: 'مهم لتحسين محركات البحث (SEO)',
      regex: /^.+$/,
      errorMsg: 'يرجى إدخال كود التحقق',
      helpSteps: [
        'افتح Google Search Console وأضف موقعك كـ "بادئة عنوان URL".',
        'في طرق إثبات الملكية، اختر "علامة HTML".',
        'قم بنسخ محتوى (content) الموجود داخل الكود المعروض فقط.',
        'مثال: إذا كان الكود <meta name="google-site-verification" content="XYZ" /> انسخ XYZ فقط.'
      ]
    },
  ];

  const validateForm = () => {
    for (const tracker of trackers) {
      const enabledKey = `${tracker.id}Enabled` as keyof typeof formData;
      const idKey = `${tracker.id}Id` as keyof typeof formData;
      const isEnabled = formData[enabledKey] === '1';
      const val = formData[idKey];

      if (isEnabled && (!val || !tracker.regex.test(val))) {
        toast.error(`${tracker.label}: ${tracker.errorMsg}`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await ApiClient.post('/settings', formData);
      await refreshSettings();
      toast.success('تم حفظ الإعدادات بنجاح. أرقام التتبع الآن فعّالة.');
    } catch (error) {
      console.error('Failed to save tracking settings:', error);
      toast.error('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (enabled: string, val: string, regex: RegExp) => {
    if (enabled === '1' && regex.test(val)) {
      return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> مهيأ ومفعل</span>;
    }
    if (enabled === '1' && !regex.test(val)) {
      return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3.5 h-3.5" /> يحتاج انتباه</span>;
    }
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"><XCircle className="w-3.5 h-3.5" /> معطل</span>;
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Helmet>
        <title>التتبع والتحليلات | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center">
          <LineChart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إعدادات التتبع والتحليلات</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">أضف أرقام التتبع الخاصة بك لربط موقعك بالمنصات الإعلانية ومحركات البحث.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trackers.map(tracker => {
              const enabledKey = `${tracker.id}Enabled` as keyof typeof formData;
              const idKey = `${tracker.id}Id` as keyof typeof formData;
              const isEnabled = formData[enabledKey] === '1';
              const val = formData[idKey];
              const isValid = !val || tracker.regex.test(val);

              return (
                <div key={tracker.id} className={`p-6 border rounded-2xl transition-all ${isEnabled ? 'border-amber-200 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-900/10' : 'border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30'}`}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{tracker.label}</h3>
                        {getStatusBadge(formData[enabledKey], val, tracker.regex)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tracker.desc}</p>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isEnabled}
                        onChange={(e) => setFormData({...formData, [enabledKey]: e.target.checked ? '1' : '0'})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  
                  <div className="mt-2 mb-4 text-xs font-semibold text-amber-600 dark:text-amber-500">
                    {tracker.recommendation}
                  </div>

                  <div className={`transition-opacity duration-300 ${!isEnabled ? 'opacity-50' : 'opacity-100'}`}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم المعرف (ID)</label>
                    <div className="relative">
                      <Input 
                        type="text" 
                        dir="ltr"
                        placeholder={tracker.placeholder}
                        value={val}
                        onChange={(e) => setFormData({...formData, [idKey]: e.target.value})}
                        disabled={!isEnabled}
                        className={`pr-24 text-left ${!isValid && isEnabled ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setActiveHelp(tracker); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> مساعدة
                      </button>
                    </div>
                    {!isValid && isEnabled && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{tracker.errorMsg}</p>
                    )}
                    {isValid && isEnabled && val && (
                      <p className="text-green-600 dark:text-green-400 text-xs mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> صيغة المعرف صحيحة
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <Button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3 rounded-xl flex items-center gap-2"
            >
              {saving ? (
                <><Loader className="w-5 h-5 text-white" /> جاري الحفظ...</>
              ) : (
                <><Save className="w-5 h-5" aria-hidden="true" /> حفظ الإعدادات</>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Modal open={!!activeHelp} onClose={() => setActiveHelp(null)} size="md">
        <Modal.Header onClose={() => setActiveHelp(null)}>
          كيف أحصل على معرف {activeHelp?.label}؟
        </Modal.Header>
        <Modal.Body>
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-xl mb-6 flex items-start gap-3">
            <HelpCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              اتبع الخطوات البسيطة التالية لاستخراج رقم التتبع من حسابك ولصقه في النظام.
            </p>
          </div>
          <ol className="space-y-4">
            {activeHelp?.helpSteps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <Button variant="primary" onClick={() => setActiveHelp(null)}>حسناً، فهمت</Button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}

