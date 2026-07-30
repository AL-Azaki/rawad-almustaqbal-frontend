import { Outlet, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300 relative" dir="rtl">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:-translate-x-1">
        <ArrowRight className="w-5 h-5" />
        <span className="font-bold text-sm">العودة للرئيسية</span>
      </Link>

      <Outlet />
    </div>
  );
}

