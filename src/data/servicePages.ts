export interface ServicePageData {
  id: string;
  slug: string;
  slugAliases: string[];
  translationKey: string;
  iconName: string;
  startingPriceAr: string;
  startingPriceEn: string;
  faqIds: string[];
  relatedCategoryKeys: string[];
}

/**
 * Single Source of Truth (SSOT) for the 6 Core Specialized Service Landing Pages (/services/:slug).
 * Provides rich metadata, canonical SEO slugs, icon references, and related linkages.
 */
export const SERVICE_PAGES_SSOT: ServicePageData[] = [
  {
    id: 'electrical',
    slug: 'electrical-services-jeddah',
    slugAliases: ['electrical', 'electrical-wiring-installation-jeddah', 'الخدمات-الكهربائية', 'تأسيس-كهرباء-جدة'],
    translationKey: 'serviceDetails.electrical',
    iconName: 'Zap',
    startingPriceAr: 'يبدأ من 150 ريال / نقطة',
    startingPriceEn: 'Starting from 150 SAR / point',
    faqIds: ['pricing', 'golden_warranty', 'safety_standards', 'smart_home_diff'],
    relatedCategoryKeys: ['network', 'surveillance', 'lighting'],
  },
  {
    id: 'network',
    slug: 'network-internet-setup-jeddah',
    slugAliases: ['network', 'network-and-internet-solutions-jeddah', 'خدمات-الشبكات-والإنترنت', 'تمديد-شبكات-جدة'],
    translationKey: 'serviceDetails.network',
    iconName: 'Wifi',
    startingPriceAr: 'يبدأ من 200 ريال / نقطة شبكة',
    startingPriceEn: 'Starting from 200 SAR / network drop',
    faqIds: ['pricing', 'golden_warranty', 'installation_obhur', 'safety_standards'],
    relatedCategoryKeys: ['electrical', 'surveillance', 'interior'],
  },
  {
    id: 'surveillance',
    slug: 'cctv-security-systems-jeddah',
    slugAliases: ['surveillance', 'cctv', 'cctv-security-surveillance-systems-jeddah', 'أنظمة-المراقبة', 'كاميرات-مراقبة-أبحر'],
    translationKey: 'serviceDetails.surveillance',
    iconName: 'Video',
    startingPriceAr: 'يبدأ من 1200 ريال (طقم كاميرات متكامل)',
    startingPriceEn: 'Starting from 1,200 SAR (Full CCTV Kit)',
    faqIds: ['pricing', 'golden_warranty', 'installation_obhur', 'emergency_response'],
    relatedCategoryKeys: ['electrical', 'network', 'lighting'],
  },
  {
    id: 'plumbing',
    slug: 'plumbing-maintenance-jeddah',
    slugAliases: ['plumbing', 'plumbing-maintenance-leak-repair-jeddah', 'السباكة', 'صيانة-سباكة-جدة'],
    translationKey: 'serviceDetails.plumbing',
    iconName: 'Droplet',
    startingPriceAr: 'يبدأ من 100 ريال / زيارة وصيانة',
    startingPriceEn: 'Starting from 100 SAR / maintenance visit',
    faqIds: ['pricing', 'golden_warranty', 'emergency_response', 'consultation'],
    relatedCategoryKeys: ['electrical', 'interior', 'lighting'],
  },
  {
    id: 'lighting',
    slug: 'lighting-decor-jeddah',
    slugAliases: ['lighting', 'lighting-decor-led-installation-jeddah', 'الإنارة-والديكور', 'تركيب-ليدات-جدة'],
    translationKey: 'serviceDetails.lighting',
    iconName: 'Lightbulb',
    startingPriceAr: 'يبدأ من 80 ريال / متر إنارة مخفية',
    startingPriceEn: 'Starting from 80 SAR / meter hidden lighting',
    faqIds: ['pricing', 'golden_warranty', 'safety_standards', 'smart_home_diff'],
    relatedCategoryKeys: ['electrical', 'interior', 'network'],
  },
  {
    id: 'interior',
    slug: 'interior-decor-gypsum-jeddah',
    slugAliases: ['interior', 'interior-decor-gypsum-ceilings-jeddah', 'الديكورات-الداخلية', 'تصميم-ديكورات-جدة'],
    translationKey: 'serviceDetails.interior',
    iconName: 'PenTool',
    startingPriceAr: 'حسب تصميم المخطط والمساحة (عرض سعر هندسي)',
    startingPriceEn: 'Custom quote based on design blueprint and area',
    faqIds: ['pricing', 'golden_warranty', 'consultation', 'payment_methods'],
    relatedCategoryKeys: ['lighting', 'electrical', 'network'],
  },
];

/**
 * Utility to resolve service details by slug, alias, or ID.
 */
export function getServicePageBySlug(slugOrId: string): ServicePageData | undefined {
  const normalized = decodeURIComponent(slugOrId).toLowerCase().trim();
  return SERVICE_PAGES_SSOT.find(
    (s) =>
      s.slug.toLowerCase() === normalized ||
      s.id.toLowerCase() === normalized ||
      s.slugAliases.some((alias) => alias.toLowerCase() === normalized)
  );
}
