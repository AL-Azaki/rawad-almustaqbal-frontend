import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AREA_CATEGORIES, SERVICE_AREAS } from '../../data/serviceAreas';

export default function GeoServiceAreas() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <section 
      className="border-t border-gray-800 mt-12 pt-10"
      aria-labelledby="geo-service-areas-heading"
    >
      <div className="mb-6">
        <h2 
          id="geo-service-areas-heading" 
          className="text-lg font-bold text-white tracking-wide border-b border-gray-700 pb-2 inline-block"
        >
          {isEn ? 'Geographical Coverage & Service Areas' : 'النطاق الجغرافي وأحياء التغطية السريعة'}
        </h2>
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">
          {isEn
            ? 'Fast on-site technical support and installation services across Jeddah and All Saudi Arabia Regions districts.'
            : 'خدمات الدعم الفني الميداني والتأسيس الفوري تغطي كافة أحياء جدة وجميع مناطق المملكة على مدار الساعة بضمان جودة معتمد.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {AREA_CATEGORIES.map((category) => {
          const areas = SERVICE_AREAS.filter((area) => area.category === category.id)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          return (
            <div key={category.id} className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-500 tracking-wider uppercase">
                {isEn ? category.titleEn : category.titleAr}
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                {areas.map((area) => (
                  <li key={area.id}>
                    <Link
                      to={area.serviceLink}
                      className="text-xs text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5 py-0.5"
                      aria-label={`${isEn ? area.nameEn : area.name} - ${isEn ? 'View Services' : 'عرض الخدمات'}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 shrink-0"></span>
                      <span className="truncate">{isEn ? area.nameEn : area.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

