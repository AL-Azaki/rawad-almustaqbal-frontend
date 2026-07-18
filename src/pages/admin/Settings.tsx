import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Globe, Phone, Mail, Building2, Link2, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../contexts/SettingsContext';
import { ApiClient } from '../../lib/api';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Loader } from '../../components/ui/Loader';
// هنا 👇تم حذف t من const { t, i18n } = useTranslation();
export default function AdminSettings() {
  const {  i18n } = useTranslation();
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    facebook: '',
    twitter: '',
    instagram: '',
    snapchat: '',
    tiktok: '',
    theme: 'light',
    language: 'ar',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        whatsappNumber: settings.whatsappNumber || '',
        facebook: settings.facebook || '',
        twitter: settings.twitter || '',
        instagram: settings.instagram || '',
        snapchat: settings.snapchat || '',
        tiktok: settings.tiktok || '',
        theme: settings.theme || 'light',
        language: settings.language || 'ar',
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await ApiClient.post('/settings', formData);
      await refreshSettings();
      
      // Update i18n language if changed
      if (formData.language !== i18n.language) {
        i18n.changeLanguage(formData.language);
        document.documentElement.dir = formData.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = formData.language;
      }

      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'إعدادات عامة', icon: Globe },
    { id: 'contact', label: 'معلومات التواصل', icon: Phone },
    { id: 'social', label: 'التواصل الاجتماعي', icon: Link2 },
    { id: 'appearance', label: 'المظهر', icon: LayoutTemplate },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Helmet>
        <title>إعدادات النظام | لوحة التحكم</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-amber-500" aria-hidden="true" />
          إعدادات النظام
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">قم بإدارة إعدادات الموقع، وتحديث معلومات التواصل والمظهر العام.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div 
          className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 p-4 border-b md:border-b-0 md:border-l border-gray-100 dark:border-gray-700"
          role="tablist"
          aria-label="أقسام الإعدادات"
        >
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isActive 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 md:p-10">
          <form onSubmit={handleSave} className="h-full flex flex-col">
            <div className="flex-1 space-y-6">
              
              {/* General Tab */}
              <div 
                role="tabpanel" 
                id="panel-general" 
                aria-labelledby="tab-general" 
                className={`${activeTab === 'general' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" aria-hidden="true" /> معلومات الموقع الأساسية
                  </h2>
                  
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم الموقع</label>
                    <Input 
                      id="siteName"
                      type="text" 
                      value={formData.siteName}
                      onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">وصف الموقع (SEO)</label>
                    <Textarea 
                      id="siteDescription"
                      rows={4}
                      value={formData.siteDescription}
                      onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Tab */}
              <div 
                role="tabpanel" 
                id="panel-contact" 
                aria-labelledby="tab-contact" 
                className={`${activeTab === 'contact' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-500" aria-hidden="true" /> قنوات التواصل الرئيسية
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني الرسمي</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="contactEmail"
                          type="email" 
                          dir="ltr"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف العام</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="contactPhone"
                          type="text" 
                          dir="ltr"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="whatsappNumber" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الواتساب (لإغلاق الصفقات)</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="whatsappNumber"
                          type="text" 
                          dir="ltr"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                          className="pr-12 pl-4 text-left border-green-200 dark:border-green-800 focus:ring-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">هذا الرقم سيظهر في الزر العائم في جميع صفحات الموقع.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Tab */}
              <div 
                role="tabpanel" 
                id="panel-social" 
                aria-labelledby="tab-social" 
                className={`${activeTab === 'social' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-amber-500" aria-hidden="true" /> شبكات التواصل الاجتماعي
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط تويتر (X)</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="twitter"
                          type="url" 
                          dir="ltr"
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط انستجرام</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="instagram"
                          type="url" 
                          dir="ltr"
                          value={formData.instagram}
                          onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="snapchat" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط سناب شات</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="snapchat"
                          type="url" 
                          dir="ltr"
                          value={formData.snapchat}
                          onChange={(e) => setFormData({...formData, snapchat: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tiktok" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط تيك توك</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-gray-300 w-5 h-5 pointer-events-none" aria-hidden="true" />
                        <Input 
                          id="tiktok"
                          type="url" 
                          dir="ltr"
                          value={formData.tiktok}
                          onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                          className="pr-12 pl-4 text-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Tab */}
              <div 
                role="tabpanel" 
                id="panel-appearance" 
                aria-labelledby="tab-appearance" 
                className={`${activeTab === 'appearance' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}`}
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-amber-500" aria-hidden="true" /> المظهر والتخصيص
                  </h2>
                  
                  <fieldset>
                    <legend className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">الوضع الافتراضي للنظام</legend>
                    <div className="flex gap-4">
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 focus-within:ring-2 focus-within:ring-amber-500 ${formData.theme === 'light' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="theme" value="light" className="sr-only" checked={formData.theme === 'light'} onChange={() => setFormData({...formData, theme: 'light'})} />
                        <div className="w-16 h-10 bg-white border border-gray-200 rounded shadow-sm" aria-hidden="true"></div>
                        <span className="font-bold">الوضع الفاتح</span>
                      </label>
                      
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 focus-within:ring-2 focus-within:ring-amber-500 ${formData.theme === 'dark' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="theme" value="dark" className="sr-only" checked={formData.theme === 'dark'} onChange={() => setFormData({...formData, theme: 'dark'})} />
                        <div className="w-16 h-10 bg-gray-900 rounded shadow-sm flex items-center justify-center" aria-hidden="true"><div className="w-8 h-4 bg-gray-800 rounded"></div></div>
                        <span className="font-bold">الوضع الداكن</span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">لغة النظام</legend>
                    <div className="flex gap-4">
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 focus-within:ring-2 focus-within:ring-amber-500 ${formData.language === 'ar' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="language" value="ar" className="sr-only" checked={formData.language === 'ar'} onChange={() => setFormData({...formData, language: 'ar'})} />
                        <span className="font-bold text-xl" aria-hidden="true">🇸🇦</span>
                        <span className="font-bold">العربية</span>
                      </label>
                      
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 focus-within:ring-2 focus-within:ring-amber-500 ${formData.language === 'en' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="language" value="en" className="sr-only" checked={formData.language === 'en'} onChange={() => setFormData({...formData, language: 'en'})} />
                        <span className="font-bold text-xl" aria-hidden="true">🇺🇸</span>
                        <span className="font-bold">English</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <Button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3 rounded-xl flex items-center gap-2"
              >
                {saving ? (
                  <><Loader className="w-5 h-5 text-white" /> جاري الحفظ...</>
                ) : (
                  <><Save className="w-5 h-5" aria-hidden="true" /> حفظ التغييرات</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
