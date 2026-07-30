import { Helmet } from 'react-helmet-async';
import { BookOpen, LineChart, Target, Link2, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const guides = [
  {
    icon: <LineChart className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    title: "Google Analytics 4 (GA4)",
    when: "استخدمه دائماً بمجرد إطلاق موقعك.",
    why: "لمعرفة عدد زوار موقعك، الصفحات التي يقرؤونها، ومن أين أتوا (جوجل، تويتر، الخ).",
    whereGet: "من حسابك في Google Analytics > المسؤول > مصادر البيانات (Measurement ID).",
    wherePaste: "في قسم 'إعدادات التتبع' داخل هذا النظام.",
    howWorks: "بعد 24 ساعة، ستظهر لك إحصائيات الزوار في لوحة تحكم جوجل أنالتكس."
  },
  {
    icon: <Target className="w-6 h-6 text-blue-600" />,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    title: "Meta Pixel (فيسبوك وانستقرام)",
    when: "قبل إطلاق أي حملة إعلانية ممولة على فيسبوك أو انستقرام.",
    why: "ليعرف فيسبوك من زار موقعك من الإعلان، ولتتمكن من إعادة استهدافهم لاحقاً.",
    whereGet: "من مدير الأحداث (Events Manager) في حسابك الإعلاني على فيسبوك.",
    wherePaste: "في قسم 'إعدادات التتبع' داخل هذا النظام.",
    howWorks: "استخدم إضافة 'Meta Pixel Helper' في متصفح كروم للتأكد من أنه يرسل البيانات."
  },
  {
    icon: <Link2 className="w-6 h-6 text-amber-500" />,
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    title: "روابط التتبع الذكية (UTM)",
    when: "عند نشر رابط موقعك في أي مكان (إعلان، تغريدة، رسالة واتساب).",
    why: "لتعرف بدقة من أين جاءت كل نقرة، وما هو الإعلان الذي جلب لك أكبر عدد من العملاء.",
    whereGet: "استخدم 'منشئ الروابط الذكية' الموجود في هذا النظام لتوليد الرابط بضغطة زر.",
    wherePaste: "انسخ الرابط النهائي وضعه في خانة (رابط الموقع) في منصة الإعلانات.",
    howWorks: "عندما ينقر شخص على الرابط، ستظهر معلوماته مقسمة في تقارير Google Analytics."
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-purple-500" />,
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
    title: "إطلاق حملة Google Ads",
    when: "عندما تريد الظهور للأشخاص الذين يبحثون عن خدماتك في بحث جوجل.",
    why: "لاستهداف العملاء ذوي النية العالية بالشراء.",
    whereGet: "قم بإنشاء حساب في Google Ads.",
    wherePaste: "استخدم 'قوالب الحملات' هنا لكتابة إعلانك، ثم انسخه والصقه في لوحة جوجل.",
    howWorks: "سيظهر إعلانك في أعلى نتائج البحث للكلمات المفتاحية التي اخترتها."
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-indigo-500" />,
    iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    title: "استخدام صفحات الهبوط",
    when: "عند إطلاق إعلان لخدمة معينة، لا توجه الزائر للرئيسية بل لصفحة الخدمة مباشرة.",
    why: "لزيادة نسبة التحويل (العميل يجد ما يبحث عنه فوراً).",
    whereGet: "من قسم 'صفحات الهبوط' في هذا النظام.",
    wherePaste: "اضغط على 'استخدم في حملة' ليتم تحويل الرابط إلى رابط تتبع UTM ثم استخدمه في إعلانك.",
    howWorks: "ستلاحظ زيادة في مدة بقاء الزائر في الموقع وزيادة في التواصل."
  }
];

export default function Guide() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Helmet>
        <title>دليل التسويق | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">دليل العمليات التسويقية</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">دليل عملي مبسط لرواد الأعمال، خطوة بخطوة وبدون مصطلحات معقدة.</p>
          </div>
        </div>
        <Link to="/admin/marketing/overview" className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors hidden sm:block">
          العودة للملخص
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 hover:shadow-md transition-shadow">
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${guide.iconBg}`}>
                {guide.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{guide.title}</h2>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">متى أستخدم هذا؟</h4>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{guide.when}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">لماذا أحتاجه؟</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{guide.why}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-1.5">من أين أحصل عليه؟</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{guide.whereGet}</p>
                
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-1.5">أين أضعه؟</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{guide.wherePaste}</p>
              </div>

              <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                <div className="text-green-500 mt-0.5">💡</div>
                <div>
                  <h4 className="text-xs font-bold text-green-700 dark:text-green-500 mb-1">كيف أعرف أنه يعمل؟</h4>
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">{guide.howWorks}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

