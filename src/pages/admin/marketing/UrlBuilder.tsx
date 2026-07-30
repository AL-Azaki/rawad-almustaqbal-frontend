import { useState, useEffect } from 'react';
import { Link2, Copy, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function UrlBuilder() {
  const [searchParams] = useSearchParams();
  const prefilledUrl = searchParams.get('url');

  const [baseUrl, setBaseUrl] = useState(prefilledUrl || window.location.origin);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  
  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    generateUrl();
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  const generateUrl = () => {
    if (!baseUrl) {
      setGeneratedUrl('');
      return;
    }

    try {
      const urlString = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const url = new URL(urlString);
      
      if (utmSource) url.searchParams.set('utm_source', utmSource);
      if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) url.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) url.searchParams.set('utm_term', utmTerm);
      if (utmContent) url.searchParams.set('utm_content', utmContent);

      setGeneratedUrl(url.toString());
    } catch (e) {
      setGeneratedUrl('');
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    toast.success('تم نسخ الرابط بنجاح! جاهز للاستخدام في إعلاناتك.');
  };

  const handleReset = () => {
    setBaseUrl(window.location.origin);
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    toast.success('تم تفريغ جميع الحقول');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Helmet>
        <title>منشئ الروابط | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
          <Link2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">منشئ الروابط (URL Builder)</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">أضف وسوم التتبع (UTM) لروابطك لتعرف بدقة من أين تأتي المبيعات والزيارات.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Form */}
        <div className="p-6 lg:p-10 flex-1 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">الرابط الأساسي (رابط صفحة الهبوط) *</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <Input 
                type="url" 
                dir="ltr"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="pl-12 text-left bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              هذا هو الرابط الذي سيتم توجيه العميل إليه بعد النقر على الإعلان. يمكنك نسخ روابط صفحات موقعك من قسم "صفحات الهبوط".
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">مصدر الزيارات (utm_source) *</label>
              <Input 
                type="text" 
                dir="ltr"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="google, facebook, snapchat"
                className="text-left"
              />
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">أمثلة:</span> google (لمحرك بحث جوجل), facebook (لفيسبوك), newsletter (للنشرة البريدية).
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">وسيط الحملة (utm_medium)</label>
              <Input 
                type="text" 
                dir="ltr"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="cpc, banner, email"
                className="text-left"
              />
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">أمثلة:</span> cpc (لإعلانات النقرة مدفوعة الثمن), email (للبريد), social (للسوشيال ميديا).
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">اسم الحملة (utm_campaign)</label>
              <Input 
                type="text" 
                dir="ltr"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="summer_sale, retargeting"
                className="text-left"
              />
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-bold text-gray-700 dark:text-gray-300">أمثلة:</span> summer_sale (لحملة الصيف), retargeting_riyadh (لإعادة الاستهداف بالرياض).
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">الكلمة المفتاحية (utm_term)</label>
              <Input 
                type="text" 
                dir="ltr"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="تأسيس كهرباء, منازل ذكية"
                className="text-left"
              />
              <p className="text-xs text-gray-500 mt-2">
                يُستخدم غالباً في إعلانات جوجل لمعرفة الكلمة التي بحث عنها المستخدم.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">محتوى الإعلان (utm_content)</label>
              <Input 
                type="text" 
                dir="ltr"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="logolink, textlink, banner_blue"
                className="text-left"
              />
              <p className="text-xs text-gray-500 mt-2">
                يُستخدم للتفريق بين إعلانين يوجهان لنفس الصفحة (مثلاً: صورة الزر الأزرق مقابل صورة الزر الأحمر).
              </p>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="w-full lg:w-[400px] bg-gray-50 dark:bg-gray-900 p-6 lg:p-8 border-t lg:border-t-0 lg:border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">الرابط النهائي</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">هذا هو الرابط الذي يجب وضعه في منصة الإعلانات لتوجيه الزوار إليه.</p>
          
          <div 
            className="w-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-900/50 shadow-sm rounded-2xl p-5 min-h-[160px] text-sm break-all font-mono text-left mb-8 relative" 
            dir="ltr"
          >
            {generatedUrl ? (
              <span className="text-gray-800 dark:text-gray-200 leading-relaxed font-semibold">{generatedUrl}</span>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Link2 className="w-8 h-8 mb-2 opacity-50" />
                <span>يرجى إدخال رابط صحيح</span>
              </div>
            )}
          </div>

          <div className="space-y-3 mt-auto">
            <Button 
              variant="primary" 
              className="w-full flex justify-center items-center gap-2 py-3.5 text-base shadow-lg shadow-amber-500/20"
              onClick={handleCopy}
              disabled={!generatedUrl || !utmSource} // utm_source is effectively required for analytics
            >
              <Copy className="w-5 h-5" />
              نسخ الرابط الجاهز
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <a 
                href={generatedUrl || '#'} 
                target="_blank" 
                rel="noreferrer"
                className={`flex justify-center items-center gap-2 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm font-semibold ${!generatedUrl ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <ExternalLink className="w-4 h-4" />
                تجربة الرابط
              </a>
              <button 
                onClick={handleReset}
                className="flex justify-center items-center gap-2 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                تفريغ الكل
              </button>
            </div>
            
            {generatedUrl && !utmSource && (
              <p className="text-red-500 text-xs text-center font-semibold mt-2">
                تنبيه: يجب إدخال مصدر الزيارات (utm_source) على الأقل ليعمل التتبع بنجاح.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

