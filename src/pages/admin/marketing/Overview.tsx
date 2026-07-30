import { useState, useEffect } from 'react';
import { getLandingPages } from '../../../lib/marketing/landingPages';
import { Helmet } from 'react-helmet-async';
import { fetchCachedTemplates } from '../../../lib/marketing/campaignTemplatesCache';
import { Link } from 'react-router-dom';
import { 
  Rocket, MousePointerClick, Megaphone, Link2, 
  CheckCircle2, XCircle, AlertCircle, ChevronLeft, ShieldCheck
} from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';


export default function Overview() {
  const { settings } = useSettings();
  const [templatesCount, setTemplatesCount] = useState(0);
  const [landingPagesCount, setLandingPagesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Fetch templates
      const templates = await fetchCachedTemplates();
      setTemplatesCount(templates?.length || 0);

      // Count landing pages (excluding dynamic detail pages and admin)
      const { count } = getLandingPages();
      setLandingPagesCount(count);
    } catch (e) {
      console.error('Error fetching dashboard counts', e);
    } finally {
      setLoading(false);
    }
  };

  const getTrackingStatus = (enabledKey: string, valKey: string) => {
    if (!settings) return 'disabled';
    const enabled = settings[enabledKey as keyof typeof settings] === '1';
    const val = settings[valKey as keyof typeof settings];
    if (enabled && val) return 'configured';
    if (enabled && !val) return 'needs_attention';
    return 'disabled';
  };

  const trackers = [
    { name: 'Google Analytics', status: getTrackingStatus('googleAnalyticsEnabled', 'googleAnalyticsId') },
    { name: 'Meta Pixel', status: getTrackingStatus('metaPixelEnabled', 'metaPixelId') },
    { name: 'TikTok Pixel', status: getTrackingStatus('tiktokPixelEnabled', 'tiktokPixelId') },
    { name: 'Snapchat Pixel', status: getTrackingStatus('snapchatPixelEnabled', 'snapchatPixelId') },
    { name: 'Tag Manager', status: getTrackingStatus('gtmEnabled', 'gtmId') },
    { name: 'Search Console', status: getTrackingStatus('googleSearchConsoleEnabled', 'googleSearchConsoleId') },
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'configured') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'needs_attention') return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'configured') return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">مهيأ</span>;
    if (status === 'needs_attention') return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">يحتاج انتباه</span>;
    return <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded text-xs font-bold">معطل</span>;
  };

  const isTrackingReady = trackers.some(t => t.status === 'configured');
  const isLandingReady = landingPagesCount > 0;
  const isTemplateReady = templatesCount > 0;
  const isOverallReady = isTrackingReady && isTemplateReady;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Helmet>
        <title>نظرة عامة على التسويق | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مركز التسويق (Marketing Center)</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">نظرة عامة على جاهزية موقعك لإطلاق الحملات الإعلانية</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Readiness Checklist */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Readiness Banner */}
          <div className={`p-6 rounded-3xl border flex items-center gap-4 ${
            isOverallReady 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            {isOverallReady ? (
              <ShieldCheck className="w-12 h-12 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-12 h-12 text-amber-500 shrink-0" />
            )}
            <div>
              <h2 className={`text-xl font-bold mb-1 ${isOverallReady ? 'text-green-800 dark:text-green-400' : 'text-amber-800 dark:text-amber-400'}`}>
                {isOverallReady ? 'الموقع جاهز لإطلاق الحملات' : 'الموقع بحاجة لبعض الإعدادات قبل الإطلاق'}
              </h2>
              <p className={`text-sm ${isOverallReady ? 'text-green-600 dark:text-green-500' : 'text-amber-600 dark:text-amber-500'}`}>
                {isOverallReady 
                  ? 'رائع! لديك أكواد تتبع مفعلة وقوالب جاهزة. يمكنك إطلاق حملاتك الآن بأمان.' 
                  : 'يرجى إكمال خطوات الجاهزية أدناه لضمان نجاح حملاتك الإعلانية وتتبعها بدقة.'}
              </p>
            </div>
          </div>

          {/* Launch Readiness Flow */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">خطوات إطلاق الحملة (Readiness Flow)</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:right-4 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
              
              {/* Step 1 */}
              <div className="relative flex gap-6 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isTrackingReady ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {isTrackingReady ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">تهيئة أكواد التتبع</h4>
                      <p className="text-gray-500 text-sm mt-1">يجب تفعيل كود تتبع واحد على الأقل لمعرفة نتائج إعلاناتك.</p>
                    </div>
                    {!isTrackingReady && (
                      <Link to="/admin/marketing/tracking" className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">تكوين الآن</Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-6 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isLandingReady ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {isLandingReady ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">اختيار صفحة هبوط</h4>
                      <p className="text-gray-500 text-sm mt-1">يوجد {landingPagesCount} صفحة جاهزة لاستقبال الزوار.</p>
                    </div>
                    <Link to="/admin/marketing/landing-pages" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">استعراض</Link>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-6 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${isTemplateReady ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {isTemplateReady ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">تجهيز نصوص الإعلان</h4>
                      <p className="text-gray-500 text-sm mt-1">{isTemplateReady ? `تم إنشاء ${templatesCount} قالب.` : 'لم تقم بإنشاء أي قوالب نصوص إعلانية بعد.'}</p>
                    </div>
                    {!isTemplateReady && (
                      <Link to="/admin/marketing/campaigns" className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">إنشاء قالب</Link>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Tracking Statuses & Quick Actions */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">حالة بكسلات التتبع</h3>
              <Link to="/admin/marketing/tracking" className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center">
                تعديل <ChevronLeft className="w-3 h-3 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {trackers.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={t.status} />
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t.name}</span>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">إحصائيات التسويق</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-800/50">
                <MousePointerClick className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{loading ? '-' : landingPagesCount}</div>
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300 mt-1">صفحة هبوط</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl text-center border border-purple-100 dark:border-purple-800/50">
                <Megaphone className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{loading ? '-' : templatesCount}</div>
                <div className="text-xs font-bold text-purple-800 dark:text-purple-300 mt-1">قالب إعلاني</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <Link to="/admin/marketing/url-builder" className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">منشئ الروابط الذكية</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">أنشئ روابط تتبع (UTM) لحملاتك بسرعة</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

