export interface CaseStudyItem {
  id: number | string;
  slug: string;
  title: { ar: string; en: string };
  category: { ar: string; en: string };
  location_district: { ar: string; en: string };
  duration: { ar: string; en: string };
  description: { ar: string; en: string };
  challenge: { ar: string; en: string };
  solution: { ar: string; en: string };
  installed_equipment: Array<{ ar: string; en: string }>;
  results: { ar: string; en: string };
  image_path: string;
  before_image_path?: string;
  after_image_path?: string;
  video_url?: string;
  video_path?: string;
}

export const PORTFOLIO_CATEGORIES = [
  { key: 'all', label: 'الكل' },
  { key: 'electrical', label: 'كهرباء' },
  { key: 'networks', label: 'شبكات' },
  { key: 'cctv', label: 'كاميرات مراقبة' },
  { key: 'access-control', label: 'أنظمة البصمة والدخول' },
  { key: 'smart-home', label: 'منازل ذكية' },
  { key: 'lighting', label: 'ديكور وإنارة' },
  { key: 'plumbing', label: 'سباكة' },
  { key: 'maintenance', label: 'صيانة' },
];

export const PORTFOLIO_CASE_STUDIES_SSOT: CaseStudyItem[] = [
  {
    id: 1,
    slug: 'smart-home-villa-al-marjan',
    title: {
      ar: 'أتمتة ذكية شاملة وحلول تحكم مركزي (KNX) لفيلا خاصة في حي المرجان، جميع مناطق المملكة',
      en: 'Complete Smart Home Automation & Central Control (KNX) for Private Villa in Al Marjan, All Saudi Arabia Regions'
    },
    category: {
      ar: 'منازل ذكية',
      en: 'Smart Homes'
    },
    location_district: {
      ar: 'حي المرجان، جميع مناطق المملكة، جدة',
      en: 'Al Marjan District, All Saudi Arabia Regions, Jeddah'
    },
    duration: {
      ar: '4 أسابيع تنفيذ واختبار ميداني',
      en: '4 Weeks Field Execution & Testing'
    },
    description: {
      ar: 'تصميم وتنفيذ نظام أتمتة كامل يعتمد على بروتوكول KNX القياسي الأوروبي للتحكم بالإضاءة المعمارية، الستائر الكهربائية، التكييف المركزي، وأنظمة الصوت المحيطي في فيلا سكنية فاخرة.',
      en: 'Design and implementation of a complete automation system based on the European standard KNX protocol controlling architectural lighting, motorized blinds, HVAC, and multi-room audio in a luxury villa.'
    },
    challenge: {
      ar: `واجه المالك في هذا المشروع السكني الفاخر في حي المرجان تحدياً معقداً تمثل في تعارض التمديدات الكهربائية السابقة مع متطلبات الأحمال الذكية، إضافة إلى عدم التوافق بين لوحات تحكم التكييف المركزي (VRF) وأنظمة الإضاءة المخفية (DALI). كما اشترط المالك عدم تشويه التشطيبات الرخامية الفاخرة أو إحداث تكسير عشوائي في الجدران، مع ضرورة ربط جميع الأنظمة (إضاءة، تكييف، ستائر، إنتركم، وكاميرات) في تطبيق واحد آمن وسريع الاستجابة على الأجهزة المحمولة وشاشات اللمس الجدارية.`,
      en: `The homeowner in this prestigious residential property in Al Marjan faced a complex challenge involving legacy wiring conflicts with smart load requirements, alongside incompatibility between VRF central HVAC controllers and DALI dimming lighting systems. The client strictly required zero disruption to existing marble finishes, alongside integrating all subsystems (lighting, HVAC, curtains, intercom, and security) into a single, highly secure, zero-latency mobile and wall-touch interface.`
    },
    solution: {
      ar: `قام المهندسون المتخصصون في العزكي تك بإجراء مسح فني دقيق وهندسة شبكة كابلات KNX موازية مع استخدام وحدات بوابة (KNX-DALI & KNX-VRF Gateways) لتحقيق التوافق التام بدون أي تكسير للرخام. تم تركيب لوحات تحكم ذكية متعددة المهام من فئة قسط، وبرمجة مشاهد ذكية تفاعلية (مثل مشهد الخروج، مشهد المساء، ومشهد توفير الطاقة) تعمل على ضبط الإضاءة والتكييف والستائر بضغطة زر أو عبر الأوامر الصوتية. كما تم تأريض الكبائن المركزية واختبار استقرار الإشارات لضمان تشغيل مستدام ومقاوم لتقلبات الجهد.`,
      en: `Future Pioneers engineers conducted a meticulous technical survey and engineered a parallel KNX bus network using specialized KNX-DALI and KNX-VRF Gateways to achieve 100% synchronization across subsystems without structural modification. Premium multi-function smart wallpads were installed, and custom automated scenes (e.g., All-Off, Evening Ambience, Energy Saver) were programmed. All central enclosures were grounded and signal tested to ensure zero packet drop and high voltage stability.`
    },
    installed_equipment: [
      { ar: 'وحدة تحكم مركزية KNX IP Router عالية الأداء', en: 'High-Performance KNX IP Router Central Controller' },
      { ar: 'بوابات ربط ذكية KNX to DALI Gateway للتحكم الدقيق بالإضاءة', en: 'KNX to DALI Gateways for Precision Dimming Control' },
      { ar: 'مشغلات ستائر ومحركات كهربائية هادئة (Silent Motor Actuators)', en: 'Silent Motor Actuators for Motorized Curtains' },
      { ar: 'شاشات لمس جدارية زجاجية مقاس 7 بوصة مع حساسة للحرارة والضوء', en: '7-inch Glass Wall Touchscreens with Built-in Temp/Lux Sensors' },
      { ar: 'كابلات بيانات شيلد (Shielded KNX Bus Cable 2x2x0.8)', en: 'Shielded KNX Bus Cabling (2x2x0.8mm)' }
    ],
    results: {
      ar: 'تحقيق خفض في استهلاك الكهرباء بنسبة 28% من خلال الإدارة الذكية للتكييف والإضاءة، مع ربط واستقرار 100% لكافة أنظمة الفيلا في لوحة تحكم واحدة.',
      en: 'Achieved a 28% reduction in electrical power consumption via smart HVAC and lighting management, with 100% operational stability across all villa subsystems.'
    },
    image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    before_image_path: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    after_image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    slug: 'fiber-network-cctv-al-shiraa',
    title: {
      ar: 'تأسيس بنية الألياف الضوئية وكاميرات مراقبة أمنية 4K مع شبكة واي فاي موحدة لفيلا في حي الشراع',
      en: 'Fiber Optic Infrastructure, 4K Security CCTV & Mesh WiFi Network for Villa in Al Shiraa'
    },
    category: {
      ar: 'كاميرات مراقبة',
      en: 'Surveillance Cameras'
    },
    location_district: {
      ar: 'حي الشراع، جميع مناطق المملكة، جدة',
      en: 'Al Shiraa District, All Saudi Arabia Regions, Jeddah'
    },
    duration: {
      ar: '3 أسابيع عمل متواصل',
      en: '3 Weeks Continuous Execution'
    },
    description: {
      ar: 'هندسة وتركيب شبكة ألياف ضوئية داخلية (FTTH/Cat6A) مع نظام مراقبة أمني محيطي عالي الدقة (4K IP CCTV) وموزعات واي فاي سقفية تغطي كافة أرجاء الفيلا والحديقة الخارجي.',
      en: 'Engineering and deployment of internal fiber optic cabling (FTTH/Cat6A) with high-definition perimeter surveillance (4K IP CCTV) and ceiling access points covering the entire villa and landscape.'
    },
    challenge: {
      ar: `عانت الفيلا الواقعة في حي الشراع من ضعف شديد في إشارة الإنترنت وتداخل في الشبكة اللاسلكية بين الطوابق، مع وجود جدران خرسانية مسلحة سميكة تمنع اختراق الإشارة. كما كانت كاميرات المراقبة القديمة تناظرية (Analog) تقدم رؤية ضبابية ليلاً وتتعرض لكابلات مكشوفة تتلف بفعل الرطوبة الساحلية المرتفعة وأملاح البحر في جميع مناطق المملكة.`,
      en: `The residential villa located in Al Shiraa suffered from severe WiFi dead zones and signal attenuation caused by dense reinforced concrete shear walls between floors. Additionally, existing legacy analog CCTV cameras provided blurry night vision and suffered from exposed exterior wiring deteriorating rapidly due to high coastal humidity and saline corrosion prevalent in All Saudi Arabia Regions.`
    },
    solution: {
      ar: `تم سحب وتمديد كابلات شبكة نحاسية معزولة Cat6A وقنوات ألياف ضوئية مقاومة للرطوبة والحرارة داخل مسارات محمية (Conduits). تم تركيب كابينة سيرفر رئيسية منظمة (24U Rack) تحتوي على لوحة تجميع Patch Panel وأجهزة توزيع POE Switch صناعية. وفي الجانب الأمني، تم نشر كاميرات IP بدقة 4K مع رؤية ليلية ملونة كاملة (ColorVu) ومقاومة للطقس (IP67)، مربوطة بجهاز تسجيل متطور NVR مع نسخ احتياطي للطاقة (UPS) يدوم لساعات عند انقطاع التيار.`,
      en: `Installed shielded Cat6A copper cabling and moisture-resistant optical pathways within heavy-duty conduits. Engineered a centralized 24U server rack housing professional patch panels and industrial POE switches. For security, deployed IP67 weatherproof 4K ColorVu IP cameras providing crystal-clear 24/7 color night surveillance, connected to a high-throughput NVR backed by a dedicated online UPS for uninterruptible operation.`
    },
    installed_equipment: [
      { ar: 'كابينة شبكات احترافية 24U Rack مع تهوية ومراوح مزدوجة', en: 'Professional 24U Network Server Rack with Dual Exhaust Fans' },
      { ar: 'موزع طاقة وشبكة (24-Port Gigabit POE+ Switch) عالي الاعتمادية', en: '24-Port Gigabit POE+ High-Throughput Managed Switch' },
      { ar: '8 نقاط وصول واي فاي سقفية (WiFi 6 Ceiling Access Points) تغطية سلسة', en: '8x Enterprise WiFi 6 Ceiling Access Points with Seamless Roaming' },
      { ar: '12 كاميرا مراقبة خارجية وداخلية بدقة 4K مع رؤية ليلية ملونة', en: '12x 4K IP Surveillance Cameras with 24/7 Color Night Vision' },
      { ar: 'جهاز تسجيل أمني NVR سعة تخزين 16 تيرابايت متصل بالشبكة', en: 'Enterprise NVR with 16TB Surveillance-Grade Hard Drive Storage' }
    ],
    results: {
      ar: 'تغطية واي فاي بنسبة 100% في جميع الطوابق والحدائق بسرعة نقل تصل إلى 1 جيجابت/ثانية، ورصد أمني محيطي فائق الوضوح يعمل على مدار الساعة.',
      en: '100% seamless WiFi coverage across all levels and grounds achieving 1 Gbps throughput, combined with crystal-clear perimeter security monitoring 24/7.'
    },
    image_path: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    slug: 'electrical-wiring-panel-al-yaqout',
    title: {
      ar: 'تأسيس وتوزيع الأحمال الكهربائية وطبلونات رئيسية وفق كود البناء السعودي لفيلا تحت الإنشاء في حي الياقوت',
      en: 'Electrical Load Distribution & Main Panel Installation Compliant with Saudi Building Code in Al Yaqout'
    },
    category: {
      ar: 'كهرباء',
      en: 'Electrical'
    },
    location_district: {
      ar: 'حي الياقوت، جميع مناطق المملكة، جدة',
      en: 'Al Yaqout District, All Saudi Arabia Regions, Jeddah'
    },
    duration: {
      ar: '5 أسابيع على مراحل العظم والتشطيب',
      en: '5 Weeks across Rough-in & Finishing Phases'
    },
    description: {
      ar: 'تنفيذ شامل لأعمال التأسيس الكهربائي، تمديد المواسير العازلة، تركيب الطبلونات الرئيسية والفرعية، موازنة الأحمال ثلاثية الأوجه (3-Phase)، وتطبيق نظام التأريض الأرضي لحماية المبنى وسكانه.',
      en: 'Comprehensive execution of electrical rough-in wiring, heavy-duty conduit routing, main/sub-panel balancing on 3-phase supply, and certified earth grounding to protect the structure and occupants.'
    },
    challenge: {
      ar: `طلب مالك الفيلا في حي الياقوت تصحيح مسار تمديدات كهربائية عشوائية قام بها مقاول سابق لم يلتزم بكود البناء السعودي (SBC 401). أظهر الفحص الميداني وجود تحميل زائد وغير متزن على أحد الفازات الرئيسية، واستخدام أسلاك تجارية غير مطابقة للمواصفات السعودية (SASO) معرضة للانصهار عند تشغيل أحمال التكييف والمصعد وسخانات المياه المركزية في آن واحد.`,
      en: `The project owner in Al Yaqout requested urgent intervention to correct hazardous, non-compliant electrical wiring left by a previous contractor violating Saudi Building Code (SBC 401). Field diagnostics revealed severe phase imbalance on the 3-phase supply and uncertified commercial cabling prone to thermal overheating under combined load from central HVAC, elevators, and water heating banks.`
    },
    solution: {
      ar: `قام فريق المقاولات الكهربائية في العزكي تك بسحب جميع الأسلاك السابقة واستبدالها بكابلات وأسلاك وطنية معتمدة من (كابلات الرياض / الترا) ذات عزل حراري مضاعف. تم تصميم وتركيب طبلونات رئيسية وفرعية من علامة (Schneider Electric) مع قواطع حماية ضد التسرب الأرضي والتماس (RCBO & MCCB). تم توزيع أحمال المكيفات والمصعد والإنارة توازناً دقيقاً بين الفازات الثلاثة (R-Y-B)، وتركيب شبكة تأريض نحاسية عميقة مع فحص مقاومة التربة لتكون أقل من 2 أوم.`,
      en: `Future Pioneers electrical engineering team stripped out non-compliant wiring and installed SASO-certified high-conduciveness cabling with double thermal insulation. Custom Schneider Electric main and distribution boards featuring advanced RCBO earth leakage protection and MCCB breakers were engineered and balanced precisely across R-Y-B phases. Deep copper grounding electrodes were driven and resistance-tested below 2 Ohms.`
    },
    installed_equipment: [
      { ar: 'طبلون رئيسي وقواطع حماية معتمدة Schneider Electric MCCB', en: 'Certified Schneider Electric Main Distribution Board & MCCB Breakers' },
      { ar: 'قواطع حماية الأرواح والتسرب الأرضي RCBO 30mA في جميع الدوائر الفرعية', en: '30mA RCBO Earth Leakage Life Protection Breakers on all Subcircuits' },
      { ar: 'أسلاك وكابلات نحاسية معتمدة بقطاعات هندسية مدروسة (4مم، 6مم، 16مم)', en: 'SASO-Certified Heavy-Duty Copper Cabling (4mm, 6mm, 16mm Cross-Sections)' },
      { ar: 'نظام تأريض أرضي متكامل مع أقطاب نحاسية وحرف تفتيش أرضية', en: 'Complete Copper Grounding System with Deep Rods & Inspection Pits' }
    ],
    results: {
      ar: 'اجتياز فحص شركة الكهرباء وكود البناء السعودي بنسبة 100% من الزيارة الأولى، مع استقرار تام للجهد الكهربائي وخلو المبنى من أي مخاطر حرارية أو التماسات.',
      en: '100% immediate compliance approval from Saudi Electricity Company and SBC inspectors on first inspection, achieving absolute voltage equilibrium.'
    },
    image_path: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    before_image_path: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    after_image_path: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    slug: 'cctv-intercom-resort-All Saudi Arabia Regions-corniche',
    title: {
      ar: 'أنظمة مراقبة أمنية محيطية وإنتركم مرئي IP متعدد النقاط لمنتجع شاطئي على كورنيش جميع مناطق المملكة',
      en: 'Perimeter CCTV Surveillance & Multi-Point IP Video Intercom for Beach Resort on All Saudi Arabia Regions Corniche'
    },
    category: {
      ar: 'أنظمة مراقبة',
      en: 'Monitoring Systems'
    },
    location_district: {
      ar: 'كورنيش جميع مناطق المملكة، جدة',
      en: 'All Saudi Arabia Regions Corniche, Jeddah'
    },
    duration: {
      ar: '3 أسابيع عمل وتكامل فني',
      en: '3 Weeks Technical Integration'
    },
    description: {
      ar: 'تأمين منتجع وشاليهات شاطئية عبر كاميرات مراقبة خارجية مقاومة للأملاح والرطوبة الشديدة، مع ربط بوابات الدخول والخروج بنظام إنتركم فيديو IP وبوابات دخول ذكية.',
      en: 'Securing a coastal resort and chalets using salt- and high-humidity-resistant exterior surveillance cameras, integrated with an IP video intercom and smart gate entry controls.'
    },
    challenge: {
      ar: `طبيعة الموقع المباشر على كورنيش جميع مناطق المملكة تفرض تحدياً بيئياً قاسياً؛ فالهواء المشبع بالرطوبة والأملاح تسبب في تأكل الكاميرات والمحولات المعدنية السابقة في أقل من عام. كما أن اتساع مساحة المنتجع تطلب تمديدات ألياف ضوئية خارجية لربط بوابات الشاليهات المتفرقة بغرفة التحكم المركزية دون فقدان جودة الإشارة أو تأخر الصورة عند استدعاء الإنتركم.`,
      en: `The direct beachfront location on All Saudi Arabia Regions Corniche presents a harsh environmental challenge; airborne salinity and elevated coastal humidity corroded previous metallic cameras and enclosures within less than a year. Furthermore, the expansive footprint required outdoor optical fiber links to connect remote chalet gates to the central control room with zero latency when handling high-def intercom calls.`
    },
    solution: {
      ar: `تم اختيار ونشر كاميرات مراقبة خارجية من سبائك خاصة مقاومة للتآكل والأملاح (Marine-grade anti-corrosion housing IP67/IK10) من علامة (Hikvision/Dahua Enterprise). تم ربط جميع النقاط الساحلية عبر كابلات ألياف ضوئية مدفونة في مواسير معزولة بختم مطاطي مانع لتسرب المياه. تم دمج محطات إنتركم مرئي IP بشاشات عالية الوضوح تتيح لحراس الأمن والزوار التواصل وفتح البوابات ببطاقات RFID أو عن بعد من الهواتف الذكية.`,
      en: `Specified and deployed marine-grade anti-corrosion housing cameras (IP67/IK10 rated) engineered specifically for saline coastal environments. Linked all remote beachfront nodes utilizing armored exterior fiber optics buried within sealed watertight conduits. Integrated high-definition IP video intercom door stations equipped with RFID access readers and remote mobile unlock functionality.`
    },
    installed_equipment: [
      { ar: '16 كاميرا مراقبة بحرية مقاومة للأملاح والتآكل (Marine-Grade Anti-Corrosion IP Cameras)', en: '16x Marine-Grade Anti-Corrosion Weatherproof IP Surveillance Cameras' },
      { ar: 'محطات إنتركم مرئي خارجية IP Video Intercom Door Stations مقاومة للماء مع كاميرا واسعة المدى', en: 'Waterproof IP Video Intercom Door Stations with Wide-Angle HD Cameras' },
      { ar: 'شاشات استقبال داخلية مقاس 10 بوصة في الاستقبال وغرف المراقبة', en: '10-inch Indoor Monitor Touchpads in Reception & Guard Stations' },
      { ar: 'أقفال كهرومغناطيسية وبوابات تحكم بالدخول (Magnetic Locks & Access Controllers)', en: 'Heavy-Duty Electromagnetic Locks & Access Controllers' }
    ],
    results: {
      ar: 'حماية محيطية شاملة 24/7 مقاومة للظروف المناخية الساحلية بنسبة 100% مع سهولة وسرعة في إدارة دخول الضيوف والزوار للمنتجع.',
      en: '100% resilient 24/7 coastal perimeter protection immune to salt corrosion, delivering streamlined guest access and real-time security management.'
    },
    image_path: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    slug: 'datacenter-network-cabling-al-shati',
    title: {
      ar: 'هندسة كبائن السيرفرات وتمديدات شبكات سريعة ومقوي واي فاي لقصر خاص في حي الشاطئ',
      en: 'Server Rack Engineering, High-Speed Network Cabling & WiFi Booster for Private Palace in Al Shati'
    },
    category: {
      ar: 'شبكات',
      en: 'Networks'
    },
    location_district: {
      ar: 'حي الشاطئ، جدة',
      en: 'Al Shati District, Jeddah'
    },
    duration: {
      ar: '4 أسابيع هندسة وتمديد وتكوين',
      en: '4 Weeks Engineering, Cabling & Configuration'
    },
    description: {
      ar: 'تنفيذ غرفة تقنية مركزية (Mini Data Center) وتنظيم كبائن 42U مع سحب آلاف الأمتار من كابلات Cat6A Shielded وتكوين شبكة VLAN متقدمة تفصل شبكة المالك عن شبكات الضيوف والخدم والتطبيقات الذكية.',
      en: 'Implementation of a dedicated residential mini-data center featuring 42U rack organization, thousands of meters of Cat6A shielded cabling, and advanced VLAN segregation isolating owner traffic from guests and automation.'
    },
    challenge: {
      ar: `يتميز القصر في حي الشاطئ بمساحات بناء واسعة وأدوار متعددة تضم مئات الأجهزة الذكية المتصلة (كاميرات، صوتيات، خوادم ترفيه منزلي، شاشات 8K، وأنظمة أمان). كانت الكابينة القديمة تعاني من تشابك الكابلات (Spaghetti Cabling)، وارتفاع درجة الحرارة، وضعف إدارة حركة المرور الشبكي مما يسبب انقطاعات متكررة في البث المباشر وبطء استجابة أوامر المنزل الذكي.`,
      en: `The sprawling private palace in Al Shati featured multi-level structures housing hundreds of connected smart devices (surveillance, multi-zone audio, home theater servers, 8K streaming, and automation). The existing enclosure suffered from severe "spaghetti cabling" tangles, thermal trapping, and poor traffic routing, resulting in frequent streaming dropouts and sluggish home automation response.`
    },
    solution: {
      ar: `تم إعادة هيكلة الغرفة التقنية بالكامل من خلال تركيب كابينة أرضية احترافية 42U Rack مع أنظمة تنظيم الكابلات الأفقية والعمودية (Cable Managers). تم تجميع وترقيم كافة كابلات Cat6A على لوحات تجميع Cat6A Patch Panels باستخدام ألوان مميزة لكل خدمة (بيانات، أمان، إنتركم، صوت). تم برمجة سويتشات إدارة متقدمة (Managed Switches) وتقسيم الشبكة إلى 5 شبكات افتراضية مستقلة (VLANs) مع ربط أجهزة أمان جدار حماية (Hardware Firewall) ومقويات واي فاي 6E لتوفير سرعة فائقة وثابتة.`,
      en: `Fully re-engineered the main equipment room by deploying a heavy-duty 42U floor-standing rack equipped with comprehensive horizontal and vertical cable management systems. Terminated, tested, and labeled every Cat6A shielded drop across high-density patch panels using color-coded categories. Configured enterprise managed switches establishing 5 isolated VLANs protected by a dedicated hardware firewall and WiFi 6E mesh access points.`
    },
    installed_equipment: [
      { ar: 'كابينة سيرفرات أرضية 42U Server Cabinet مع مراوح وأنظمة إدارة الكابلات', en: '42U Enterprise Floor-Standing Server Cabinet with Thermal Management' },
      { ar: 'سويتشات إدارة شبكات 48-Port Managed POE+ Switches عالية السرعة', en: '48-Port Managed Gigabit POE+ Switches with 10G Uplinks' },
      { ar: 'لوحات تجميع Cat6A Patch Panels مع ترقيم واختبار Fluke الفني', en: 'Cat6A Shielded Patch Panels Certified via Fluke Cable Diagnostics' },
      { ar: 'جهاز حماية وجدار ناري Hardware Security Gateway للتحكم بالتدفق والتأمين', en: 'Hardware Security Gateway & Enterprise Firewall Router' },
      { ar: '14 نقطة وصول واي فاي Tri-Band WiFi 6E Access Points فائقة المدى', en: '14x Tri-Band WiFi 6E Enterprise Access Points' }
    ],
    results: {
      ar: 'تنظيم هندسي استثنائي للكابينة مع استقرار شبكي فائق وثبات في نقل البيانات وسرعة استجابة فورية لكافة أنظمة القصر.',
      en: 'Impeccable architectural rack aesthetics and zero-packet-loss stability across all palace zones and automation endpoints.'
    },
    image_path: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    before_image_path: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    after_image_path: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    slug: 'smart-lighting-automation-al-muhammadiyah',
    title: {
      ar: 'تصميم وتنفيذ الإضاءة المعمارية المخفية وتحكم ذكي بالستائر والتكييف لفيلا في حي المحمدية',
      en: 'Architectural Concealed Lighting Design & Smart Curtain/HVAC Automation for Villa in Al Muhammadiyah'
    },
    category: {
      ar: 'ديكور وإنارة',
      en: 'Decor & Lighting'
    },
    location_district: {
      ar: 'حي المحمدية، جدة',
      en: 'Al Muhammadiyah District, Jeddah'
    },
    duration: {
      ar: '3 أسابيع تصميم وتنفيذ',
      en: '3 Weeks Design & Execution'
    },
    description: {
      ar: 'تكامل فني بين تصميم الإضاءة الديكورية الحديثة (LED Strips, Magnetic Tracks, Downlights) ونظام التحكم الذكي لتوفير أجواء إضاءة فخمة ومتغيرة تتناغم مع الديكور الداخلي وتحاكي الضوء الطبيعي.',
      en: 'Artful integration between modern architectural decor lighting (magnetic tracks, linear LED profiles, recessed downlights) and smart dimming automation creating luxurious dynamic lighting ambiances replicating natural circadian rhythms.'
    },
    challenge: {
      ar: `كان التحدي في فيلا حي المحمدية هو تحقيق إضاءة معمارية دافئة وموزعة هندسياً دون ظهور نقاط وهج مزعجة (Glare-free UGR<19) للعين، مع ضرورة إخفاء محولات الطاقة (LED Drivers) في أماكن يمكن الوصول إليها للصيانة دون تشويه الأسقف الجبسية الفاخرة. كما تطلب العمل دمج ستائر النوافذ الزجاجية العملاقة والمكيفات المخفية مع الإضاءة في سيناريوهات موحدة.`,
      en: `The primary challenge in this Al Muhammadiyah villa was achieving perfectly distributed, glare-free architectural warm illumination (UGR<19) while housing high-wattage LED drivers in accessible maintenance bays without compromising decorative gypsum ceilings. Additionally, oversized double-height motorized window shades required seamless synchronization with lighting and HVAC profiles.`
    },
    solution: {
      ar: `تم دراسة توزيع الإضاءة ببرامج الهندسة الضوئية واختيار وحدات إنارة ذات معامل إظهار لوني ممتاز (CRI>92) لضمان إبراز جمال الرخام والأثاث. تم سحب التمديدات إلى خزائن جانبية مخفية تضم محولات Dimmable Drivers عالية الجودة، وربطها بمفاتيح ذكية متطورة وشطائر تحكم بالستائر. تم برمجة مشاهد إضاءة تحاكي ضوء الصباح الدافئ والمساحات المسائية الهادئة، مع خفض التكييف تلقائياً وإغلاق الستائر عند التعرض لأشعة الشمس المباشرة ظهراً.`,
      en: `Conducted photometrically accurate lighting simulations specifying luminaire profiles boasting exceptional color rendering (CRI>92) to highlight marble and luxury furnishings. Routed all low-voltage feeds to accessible, concealed service cabinets housing premium dimmable drivers. Interfaced motorized shading tracks and HVAC gateways, programming circadian rhythm scenes adjusting color temperatures and blinds automatically according to solar orientation.`
    },
    installed_equipment: [
      { ar: 'مسارات إضاءة مغناطيسية Magnetic Track Lights مع وحدات بؤرية مانعة للوهج', en: 'Architectural Magnetic Track Lights with Anti-Glare Optical Lenses (UGR<19)' },
      { ar: 'أشرطة إضاءة خطية LED Strips عالية النقاوة CRI>92 مع قطاعات ألمنيوم تبريد', en: 'High-Purity Linear LED Strip Profiles (CRI>92) with Aluminum Heatsinks' },
      { ar: 'محولات طاقة ومحركات تعتيم DALI/0-10V Dimmable Drivers موثوقة', en: 'Enterprise DALI/0-10V Precision Dimmable Power Drivers' },
      { ar: 'محركات ستائر ذكية صامتة مدمجة مع نظام التحكم المركزي', en: 'Ultra-Quiet Smart Motorized Curtain Tracks Integrated with Central Hub' }
    ],
    results: {
      ar: 'تحول جمالي مذهل في الفراغات المعمارية مع راحة بصرية فائقة للعين وسهولة مطلقة في استدعاء المشاهد الضوئية المفضلة.',
      en: 'Stunning architectural aesthetic transformation delivering superior visual comfort and effortless call-up of customized ambience presets.'
    },
    image_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  }
];

