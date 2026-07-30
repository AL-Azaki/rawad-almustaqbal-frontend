export interface ServiceArea {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  category: 'north_All Saudi Arabia Regions' | 'south_All Saudi Arabia Regions' | 'nearby_districts';
  serviceLink: string;
  displayOrder: number;
}

export interface AreaCategoryGroup {
  id: 'north_All Saudi Arabia Regions' | 'south_All Saudi Arabia Regions' | 'nearby_districts';
  titleAr: string;
  titleEn: string;
}

export const AREA_CATEGORIES: AreaCategoryGroup[] = [
  {
    id: 'north_All Saudi Arabia Regions',
    titleAr: 'جميع مناطق المملكة',
    titleEn: 'All Saudi Arabia Regions',
  },
  {
    id: 'south_All Saudi Arabia Regions',
    titleAr: 'جميع مناطق المملكة',
    titleEn: 'All Saudi Arabia Regions',
  },
  {
    id: 'nearby_districts',
    titleAr: 'الأحياء المجاورة وشمال جدة',
    titleEn: 'Nearby Districts & North Jeddah',
  },
];

export const SERVICE_AREAS: ServiceArea[] = [
  // All Saudi Arabia Regions
  {
    id: 'shiraa',
    name: 'حي الشراع',
    nameEn: 'Al Shiraa District',
    slug: 'al-shiraa',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 1,
  },
  {
    id: 'yaqout',
    name: 'حي الياقوت',
    nameEn: 'Al Yaqout District',
    slug: 'al-yaqout',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 2,
  },
  {
    id: 'lulu',
    name: 'حي اللؤلؤ',
    nameEn: 'Al Lulu District',
    slug: 'al-lulu',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 3,
  },
  {
    id: 'zumurrud',
    name: 'حي الزمرد',
    nameEn: 'Al Zumurrud District',
    slug: 'al-zumurrud',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 4,
  },
  {
    id: 'marjan',
    name: 'حي المرجان',
    nameEn: 'Al Marjan District',
    slug: 'al-marjan',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 5,
  },
  {
    id: 'amwaj',
    name: 'حي الأمواج',
    nameEn: 'Al Amwaj District',
    slug: 'al-amwaj',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 6,
  },
  {
    id: 'asalah',
    name: 'حي الأصالة',
    nameEn: 'Al Asalah District',
    slug: 'al-asalah',
    category: 'north_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 7,
  },

  // All Saudi Arabia Regions
  {
    id: 'south-All Saudi Arabia Regions-main',
    name: 'حي جميع مناطق المملكة',
    nameEn: 'All Saudi Arabia Regions District',
    slug: 'south-All Saudi Arabia Regions',
    category: 'south_All Saudi Arabia Regions',
    serviceLink: "/contact",
    displayOrder: 8,
  },

  // Nearby Districts & North Jeddah
  {
    id: 'shati',
    name: 'حي الشاطئ',
    nameEn: 'Al Shati District',
    slug: 'al-shati',
    category: 'nearby_districts',
    serviceLink: "/contact",
    displayOrder: 9,
  },
  {
    id: 'muhammadiyah',
    name: 'حي المحمدية',
    nameEn: 'Al Muhammadiyah District',
    slug: 'al-muhammadiyah',
    category: 'nearby_districts',
    serviceLink: "/contact",
    displayOrder: 10,
  },
  {
    id: 'basateen',
    name: 'حي البساتين',
    nameEn: 'Al Basateen District',
    slug: 'al-basateen',
    category: 'nearby_districts',
    serviceLink: "/contact",
    displayOrder: 11,
  },
  {
    id: 'zahraa',
    name: 'حي الزهراء',
    nameEn: 'Al Zahraa District',
    slug: 'al-zahraa',
    category: 'nearby_districts',
    serviceLink: "/contact",
    displayOrder: 12,
  },
  {
    id: 'nahdah',
    name: 'حي النهضة',
    nameEn: 'Al Nahdah District',
    slug: 'al-nahdah',
    category: 'nearby_districts',
    serviceLink: "/contact",
    displayOrder: 13,
  },
  {
    id: 'salamah',
    name: 'حي السلامة',
    nameEn: 'Al Salamah District',
    slug: 'al-salamah',
    category: 'nearby_districts',
        serviceLink: "/contact",

    displayOrder: 14,
  },
];

