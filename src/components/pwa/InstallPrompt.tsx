import { AnimatePresence, motion } from 'framer-motion'
import { Download, Share2, Smartphone, X } from 'lucide-react'
import { usePWAInstall } from '../../hooks/usePWAInstall'

export default function InstallPrompt() {
  const { visible, ios, install, dismiss } = usePWAInstall()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:w-[390px]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-slate-400 transition hover:text-white"
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>

            <div className="p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500">
                  <Smartphone className="text-slate-900" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    تثبيت تطبيق العزكي تك
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    ثبّت تطبيق العزكي تك للوصول السريع إلى خدماتنا، واطلب الخدمة مباشرة من الشاشة الرئيسية لهاتفك بتجربة أسرع وأكثر سلاسة.
                  </p>
                </div>

              </div>

              {/* Benefits */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                  ⚡ وصول أسرع
                </span>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                  📱 يعمل كتطبيق
                </span>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                  🔒 تجربة آمنة
                </span>
              </div>

              {ios ? (
                <div className="mt-6 rounded-xl bg-slate-800 p-4 text-sm leading-7 text-slate-300">

                  <div className="mb-3 flex items-center gap-2 font-semibold text-white">
                    <Share2 size={18} />
                    لتثبيت تطبيق العزكي تك على iPhone
                  </div>

                  <ol className="list-decimal space-y-2 pr-5">
                    <li>افتح قائمة المشاركة في Safari.</li>
                    <li>اختر "إضافة إلى الشاشة الرئيسية".</li>
                    <li>اضغط "إضافة" لإكمال تثبيت التطبيق.</li>
                  </ol>

                </div>
              ) : (
                <button
                  onClick={install}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-slate-900 transition hover:bg-amber-400"
                >
                  <Download size={18} />
                    تثبيت الآن
                </button>
              )}

              <button
                onClick={dismiss}
                className="mt-3 w-full rounded-xl border border-slate-700 py-3 text-slate-300 transition hover:bg-slate-800"
              >
                متابعة التصفح
              </button>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}