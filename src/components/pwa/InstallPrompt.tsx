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
          <div className="rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500">
                  <Smartphone className="text-slate-900" />
                </div>

                <div>
                  <h2 className="font-bold text-white text-lg">
                    تثبيت التطبيق
                  </h2>

                  <p className="text-slate-300 text-sm mt-1">
                    احصل على تجربة أسرع وافتح الموقع مثل أي تطبيق على هاتفك.
                  </p>
                </div>

              </div>

              {ios ? (
                <div className="mt-6 rounded-xl bg-slate-800 p-4 text-sm text-slate-300 leading-7">

                  <div className="flex items-center gap-2 mb-3 font-semibold text-white">
                    <Share2 size={18} />
                    خطوات التثبيت على iPhone
                  </div>

                  <ol className="list-decimal pr-5 space-y-2">
                    <li>اضغط زر المشاركة في Safari.</li>
                    <li>اختر Add to Home Screen.</li>
                    <li>اضغط Add.</li>
                  </ol>

                </div>
              ) : (
                <button
                  onClick={install}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-slate-900 transition hover:bg-amber-400"
                >
                  <Download size={18} />
                  تثبيت التطبيق
                </button>
              )}

              <button
                onClick={dismiss}
                className="mt-3 w-full rounded-xl border border-slate-700 py-3 text-slate-300 hover:bg-slate-800"
              >
                لاحقًا
              </button>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}