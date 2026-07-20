import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, Plus, Search, BookOpen, X, CheckCircle2, Clock, Globe, UploadCloud, Image as ImageIcon, Zap, Cpu, Video, Wifi, Wrench, Shield, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiClient, getImageUrl } from '../../lib/api';

interface BlogPost {
  id: number;
  slug: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  category_ar: string;
  category_en: string;
  image_path: string;
  reading_time: number;
  related_service_slug: string;
  author_name: string;
  status: 'published' | 'draft';
  published_at: string;
}

const TEMPLATES = [
  {
    id: 'electrical',
    label: 'أعمال الكهرباء (Electrical)',
    icon: Zap,
    data: {
      category_ar: 'الكهرباء والطاقة',
      category_en: 'Electrical & Energy',
      related_service_slug: 'electrical-services-jeddah',
      slug: 'electrical-safety-and-maintenance-guide',
      title_ar: 'الدليل الشامل لفحص وصيانة التمديدات الكهربائية في المنشآت',
      title_en: 'Complete Guide to Electrical Maintenance and Safety',
      excerpt_ar: 'دليل هندسي متكامل للتعرف على المشاكل الكهربائية الشائعة وأسبابها، مع خطوات عملية للحماية وتوفير استهلاك الطاقة.',
      excerpt_en: 'A comprehensive engineering guide to identifying common electrical issues and their causes, with actionable steps for protection and energy saving.',
      content_ar: `## مقدمة\nتعتبر الأنظمة الكهربائية عصب الحياة في أي منشأة... \n\n## المشاكل الشائعة\n* انقطاع التيار المتكرر\n* التماس الكهربائي\n* ارتفاع الفاتورة بشكل غير مبرر\n\n## الأسباب الفنية\nغالباً ما تعود هذه المشاكل إلى التأسيس السيء أو تقادم الأسلاك...\n\n## الحلول الهندسية والتوصيات\n1. فحص لوحة القواطع الرئيسية.\n2. استخدام أجهزة القياس الحرارية.\n\n## خطوات التنفيذ\n* فصل التيار.\n* الفحص والمعالجة.\n\n## أسئلة شائعة (FAQ)\n**س: متى يجب تغيير القاطع الرئيسي؟**\nج: ينصح بتغييره عند ملاحظة حرارة عالية أو أصوات طنين مستمرة.\n\n## الخاتمة\nالصيانة الوقائية تحميك من المخاطر...\n\n## اطلب استشارة هندسية\nللفحص الميداني، تواصل مع فريق رواد المستقبل.`,
      content_en: `## Introduction\nElectrical systems are the backbone of any facility...\n\n## Common Problems\n* Frequent breaker trips\n* Short circuits\n* High energy bills\n\n## Technical Causes\nThese issues are often due to poor wiring or aging components...\n\n## Engineering Solutions & Recommendations\n1. Inspect main breaker panel.\n2. Thermal imaging checks.\n\n## Implementation Steps\n* Disconnect power.\n* Inspect and repair.\n\n## FAQ\n**Q: When should the main breaker be replaced?**\nA: When excessive heat or buzzing is detected.\n\n## Conclusion\nPreventive maintenance protects you...\n\n## Request Engineering Audit\nContact Future Pioneers for field testing.`,
    }
  },
  {
    id: 'cctv',
    label: 'أنظمة المراقبة (CCTV)',
    icon: Video,
    data: {
      category_ar: 'أنظمة المراقبة والسلامة',
      category_en: 'Security & Surveillance',
      related_service_slug: 'cctv-systems-jeddah',
      slug: 'how-to-choose-the-best-cctv-system',
      title_ar: 'كيف تختار نظام كاميرات المراقبة الأفضل لمنزلك أو منشأتك',
      title_en: 'How to Choose the Best CCTV System for Your Property',
      excerpt_ar: 'تعرف على الفروق بين أنواع كاميرات المراقبة، وكيفية توزيعها هندسياً لتغطية جميع النقاط العمياء.',
      excerpt_en: 'Learn the differences between CCTV cameras and how to engineer their placement to eliminate blind spots.',
      content_ar: `## مقدمة\nمع تطور التكنولوجيا، أصبحت أنظمة المراقبة ضرورة أمنية...\n\n## المشاكل الشائعة\n* وجود نقاط عمياء في التغطية\n* ضعف جودة الصورة ليلاً\n\n## الأسباب الفنية\nالاختيار الخاطئ للعدسة أو ضعف الإضاءة...\n\n## الحلول الهندسية\n1. اختيار كاميرات تدعم الرؤية الليلية الملونة.\n2. حساب زوايا الرؤية بدقة.\n\n## الخاتمة\nالنظام الأمني الناجح يبدأ بتصميم هندسي صحيح.`,
      content_en: `## Introduction\nWith technological advancements, surveillance systems are essential...\n\n## Common Problems\n* Blind spots\n* Poor night vision\n\n## Technical Causes\nWrong lens selection or poor lighting...\n\n## Engineering Solutions\n1. Choose color night vision cameras.\n2. Accurately calculate viewing angles.\n\n## Conclusion\nA successful security system starts with proper engineering design.`,
    }
  },
  {
    id: 'network',
    label: 'الشبكات والسنترال (Network)',
    icon: Wifi,
    data: {
      category_ar: 'الشبكات والسنترال',
      category_en: 'Network & PBX',
      related_service_slug: 'network-fiber-jeddah',
      slug: 'structured-cabling-and-fiber-optic-setup',
      title_ar: 'تأسيس شبكات الفايبر والسنترال: الأسس الهندسية لضمان سرعة واستقرار الاتصال',
      title_en: 'Fiber Optic & PBX Setup: Engineering Basics for High-Speed Connectivity',
      excerpt_ar: 'أهم المعايير الهندسية عند تأسيس شبكات الإنترنت والسنترال للمنازل والمكاتب لتجنب ضعف الإشارة.',
      excerpt_en: 'Key engineering standards when setting up internet and PBX networks for homes and offices to avoid weak signals.',
      content_ar: `## مقدمة\nاستقرار شبكة الإنترنت أصبح من أساسيات العمل والحياة...\n\n## المشاكل الشائعة\n* ضعف إشارة الواي فاي\n* انقطاع الاتصال المتكرر\n\n## الأسباب الفنية\nسوء جودة الكابلات، عدم استخدام أسلاك Cat6، وضعف التوزيع...\n\n## الحلول الهندسية\nتأسيس كبائن شبكات احترافية وتوزيع أجهزة Access Points بشكل مدروس.`,
      content_en: `## Introduction\nNetwork stability is now essential for work and life...\n\n## Common Problems\n* Weak Wi-Fi signal\n* Frequent disconnections\n\n## Technical Causes\nPoor cable quality, not using Cat6, and bad distribution...\n\n## Engineering Solutions\nProfessional network racks and strategic Access Point placement.`,
    }
  },
  {
    id: 'smarthome',
    label: 'المنازل الذكية (Smart Home)',
    icon: Cpu,
    data: {
      category_ar: 'الأنظمة الذكية',
      category_en: 'Smart Systems',
      related_service_slug: 'smart-home-jeddah',
      slug: 'smart-home-automation-guide-jeddah',
      title_ar: 'دليل تحويل منزلك إلى منزل ذكي: التقنيات والفوائد',
      title_en: 'Guide to Smart Home Automation: Technologies and Benefits',
      excerpt_ar: 'كيف تبدأ في تحويل منزلك لنظام ذكي يوفر لك الراحة، الأمان، وكفاءة استهلاك الطاقة.',
      excerpt_en: 'How to start automating your home for comfort, security, and energy efficiency.',
      content_ar: `## مقدمة\nالمنازل الذكية لم تعد خيالاً بل واقعاً ملموساً...\n\n## المشاكل الشائعة للأنظمة التقليدية\n* هدر الطاقة\n* صعوبة التحكم بالأنظمة عن بعد\n\n## الحلول الهندسية\nاستخدام تقنيات KNX أو Zigbee لربط الإضاءة والتكييف...\n\n## الخاتمة\nالاستثمار في الأنظمة الذكية يرفع قيمة العقار ويقلل التكاليف.`,
      content_en: `## Introduction\nSmart homes are no longer fiction but reality...\n\n## Common Traditional Problems\n* Energy waste\n* Inability to control systems remotely\n\n## Engineering Solutions\nUsing KNX or Zigbee protocols to link lighting and HVAC...\n\n## Conclusion\nInvesting in smart systems increases property value and lowers costs.`,
    }
  },
  {
    id: 'plumbing',
    label: 'السباكة الحرارية (Plumbing)',
    icon: Wrench,
    data: {
      category_ar: 'السباكة وتأسيس المياه',
      category_en: 'Plumbing & Water Systems',
      related_service_slug: 'thermal-plumbing-jeddah',
      slug: 'importance-of-certified-thermal-plumbing',
      title_ar: 'أهمية السباكة الحرارية المعتمدة واختبارات الضغط للمباني',
      title_en: 'The Importance of Certified Thermal Plumbing and Pressure Testing',
      excerpt_ar: 'لماذا تعتبر أنابيب السباكة الحرارية الخيار الأفضل، وكيف يتم اختبار الضغط لتجنب التسربات المستقبلية؟',
      excerpt_en: 'Why thermal plumbing pipes are the best choice, and how pressure testing prevents future leaks.',
      content_ar: `## مقدمة\nتعتبر تسربات المياه من أخطر المشاكل التي تهدد البنية التحتية للمباني...\n\n## المشاكل الشائعة\n* تسرب المياه تحت البلاط\n* الرطوبة وتلف الدهانات\n\n## الأسباب الفنية\nاستخدام مواد غير أصلية أو لحام حراري خاطئ...\n\n## الحلول الهندسية\nتطبيق اختبار الضغط بالمكينة وتوثيق النتائج.`,
      content_en: `## Introduction\nWater leaks are among the most dangerous threats to building infrastructure...\n\n## Common Problems\n* Sub-tile water leakage\n* Dampness and paint damage\n\n## Technical Causes\nUsing unauthentic materials or incorrect thermal welding...\n\n## Engineering Solutions\nApplying machine pressure testing and documenting results.`,
    }
  },
  {
    id: 'maintenance',
    label: 'عقود الصيانة (Maintenance)',
    icon: Shield,
    data: {
      category_ar: 'الصيانة والتشغيل',
      category_en: 'Maintenance & Operation',
      related_service_slug: 'maintenance-contracts-jeddah',
      slug: 'preventive-maintenance-contracts-benefits',
      title_ar: 'عقود الصيانة الوقائية: الدرع الواقي لمنشأتك التجارية',
      title_en: 'Preventive Maintenance Contracts: The Shield for Your Commercial Facility',
      excerpt_ar: 'تعرف على الفوائد الاقتصادية والفنية لإبرام عقود الصيانة الدورية وكيف تتجنب الأعطال المفاجئة.',
      excerpt_en: 'Discover the economic and technical benefits of regular maintenance contracts and how to avoid sudden breakdowns.',
      content_ar: `## مقدمة\nالأعطال المفاجئة في الأنظمة تكلف الكثير من الوقت والمال...\n\n## المشاكل الشائعة بدون صيانة\n* توقف العمل\n* تكاليف إصلاح طارئة مرتفعة\n\n## الحلول الهندسية\nجدولة زيارات صيانة وقائية شهرية أو ربع سنوية...\n\n## الخاتمة\nدرهم وقاية خير من قنطار علاج.`,
      content_en: `## Introduction\nSudden system failures cost significant time and money...\n\n## Common Problems without Maintenance\n* Operational downtime\n* High emergency repair costs\n\n## Engineering Solutions\nScheduling monthly or quarterly preventive maintenance visits...\n\n## Conclusion\nPrevention is better than cure.`,
    }
  }
];

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultForm = {
    slug: '',
    title_ar: '',
    title_en: '',
    excerpt_ar: '',
    excerpt_en: '',
    content_ar: '',
    content_en: '',
    category_ar: 'عام',
    category_en: 'General',
    image_path: '',
    reading_time: 5,
    related_service_slug: 'electrical-services-jeddah',
    author_name: 'فريق مهندسي رواد المستقبل',
    status: 'published' as 'published' | 'draft',
  };
  
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get<any[]>('/blog');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب المقالات');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    if (post) {
      setEditingPost(post);
      setFormData({
        slug: post.slug,
        title_ar: typeof post.title_ar === 'string' ? post.title_ar : (post as any).title?.ar || '',
        title_en: typeof post.title_en === 'string' ? post.title_en : (post as any).title?.en || '',
        excerpt_ar: typeof post.excerpt_ar === 'string' ? post.excerpt_ar : (post as any).excerpt?.ar || '',
        excerpt_en: typeof post.excerpt_en === 'string' ? post.excerpt_en : (post as any).excerpt?.en || '',
        content_ar: typeof post.content_ar === 'string' ? post.content_ar : (post as any).content?.ar || '',
        content_en: typeof post.content_en === 'string' ? post.content_en : (post as any).content?.en || '',
        category_ar: typeof post.category_ar === 'string' ? post.category_ar : (post as any).category?.ar || '',
        category_en: typeof post.category_en === 'string' ? post.category_en : (post as any).category?.en || '',
        image_path: post.image_path || '',
        reading_time: post.reading_time || 5,
        related_service_slug: post.related_service_slug || '',
        author_name: post.author_name || 'فريق مهندسي رواد المستقبل',
        status: post.status || 'published',
      });
      setImagePreview(post.image_path || null);
    } else {
      setEditingPost(null);
      setFormData(defaultForm);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const applyTemplate = (templateId: string) => {
    if (!templateId) return;
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    setFormData(prev => ({
      ...prev,
      ...tpl.data
    }));
    toast.success(`تم تطبيق قالب: ${tpl.label}`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        setImageFile(file);
        
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        toast.error('صيغة الملف غير مدعومة. الرجاء رفع صورة (JPG, PNG, WEBP).');
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    if (editingPost?.image_path) {
      setImagePreview(editingPost.image_path); // Fallback to original URL
    } else {
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image_path: '' }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isUpdating = !!editingPost;
      const url = isUpdating ? `/blog/${editingPost.id}` : '/blog';
      
      let finalData: any;
      const headers: Record<string, string> = {};

      if (imageFile) {
        finalData = new FormData();
        Object.keys(formData).forEach(key => {
          finalData.append(key, formData[key as keyof typeof formData] as any);
        });
        finalData.append('image', imageFile);
        if (isUpdating) {
          finalData.append('_method', 'PUT'); // Trick Laravel into handling PUT with FormData
        }
        headers['Content-Type'] = 'multipart/form-data';
        
        // Since FormData uses POST for file uploads (with _method=PUT for updates):
        await ApiClient.post(url, finalData, { headers });
      } else {
        // Standard JSON payload
        finalData = formData;
        if (isUpdating) {
          await ApiClient.put(url, finalData);
        } else {
          await ApiClient.post(url, finalData);
        }
      }

      toast.success(isUpdating ? 'تم تحديث المقال بنجاح' : 'تمت إضافة المقال بنجاح');
      setIsModalOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      try {
        await ApiClient.delete(`/blog/${id}`);
        toast.success('تم حذف المقال بنجاح');
        fetchPosts();
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const titleAr = typeof post.title_ar === 'string' ? post.title_ar : (post as any).title?.ar || '';
    return titleAr.toLowerCase().includes(searchQuery.toLowerCase());
  });



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            إدارة المدونة والمقالات
          </h1>
          <p className="text-gray-500 text-sm mt-1">أضف، عدّل، أو احذف المقالات الهندسية باستخدام قوالب النماذج الذكية.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة مقال جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في المقالات..."
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">المقال</th>
                <th className="p-4 font-semibold text-gray-600">التصنيف</th>
                <th className="p-4 font-semibold text-gray-600 text-center">الرابط المرجعي (Slug)</th>
                <th className="p-4 font-semibold text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    لا توجد مقالات مضافة حتى الآن.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const titleAr = typeof post.title_ar === 'string' ? post.title_ar : (post as any).title?.ar || '';
                  const categoryAr = typeof post.category_ar === 'string' ? post.category_ar : (post as any).category?.ar || '';
                  return (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={getImageUrl(post.image_path)} 
                            alt={titleAr}
                            className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{titleAr}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> 
                              {post.reading_time || 5} دقائق قراءة
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                          {categoryAr}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <code className="text-xs bg-gray-100 text-amber-600 px-2 py-1 rounded">
                          {post.slug}
                        </code>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل المقال"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف المقال"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-5 border-b border-gray-100 flex justify-between items-center z-20">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {editingPost ? <Pencil className="w-6 h-6 text-amber-500" /> : <Plus className="w-6 h-6 text-amber-500" />}
                {editingPost ? 'تعديل المقال' : 'إنشاء مقال هندسي'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Smart Template Assistant */}
              {!editingPost && (
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-4">
                    <Wand2 className="w-5 h-5" />
                    المساعد الذكي لإنشاء المقالات
                  </h3>
                  <p className="text-sm text-amber-700 mb-4">اختر الخدمة لإنشاء هيكل مقال احترافي جاهز للتحرير ومحسن لمحركات البحث (SEO).</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TEMPLATES.map(tpl => {
                      const Icon = tpl.icon;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl.id)}
                          className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl transition-colors text-sm font-semibold shadow-sm"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{tpl.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Featured Image & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Image Upload Column */}
                <div className="md:col-span-4 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">الصورة البارزة للمقال <span className="text-red-500">*</span></label>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                    />
                    
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-amber-500 transition-colors">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/20 hover:bg-white text-white hover:text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                          >
                            تغيير الصورة
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                          >
                            حذف الصورة
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-colors"
                      >
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-bold text-gray-600">رفع صورة جديدة</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 2MB)</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">أو استخدم رابط صورة خارجية (URL)</label>
                    <div className="relative">
                      <ImageIcon className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.image_path}
                        onChange={e => setFormData({...formData, image_path: e.target.value})}
                        disabled={!!imageFile}
                        className="w-full pr-9 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 disabled:bg-gray-100"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Main Meta Info Column */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الرابط التعريفي (Slug) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left"
                      dir="ltr"
                      placeholder="e.g. causes-of-circuit-breaker-tripping"
                    />
                    <p className="text-xs text-amber-600 mt-1 font-medium">نصيحة SEO: يجب أن يكون الرابط باللغة الإنجليزية ويعكس محتوى المقال.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رابط الخدمة المرتبطة للاستدعاء (CTA)</label>
                      <input
                        type="text"
                        value={formData.related_service_slug}
                        onChange={e => setFormData({...formData, related_service_slug: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">حالة النشر</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                      >
                        <option value="published">منشور (Published)</option>
                        <option value="draft">مسودة (Draft)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Content Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                {/* Arabic Side */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" /> المحتوى العربي
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">العنوان (H1) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.title_ar}
                      onChange={e => setFormData({...formData, title_ar: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الوصف المختصر (Meta Description) <span className="text-red-500">*</span></label>
                    <textarea
                      rows={2}
                      required
                      value={formData.excerpt_ar}
                      onChange={e => setFormData({...formData, excerpt_ar: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                      <span>محتوى المقال (يدعم Markdown) <span className="text-red-500">*</span></span>
                    </label>
                    <textarea
                      rows={12}
                      required
                      value={formData.content_ar}
                      onChange={e => setFormData({...formData, content_ar: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                      <input
                        type="text"
                        value={formData.category_ar}
                        onChange={e => setFormData({...formData, category_ar: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">وقت القراءة (دقائق)</label>
                      <input
                        type="number"
                        value={formData.reading_time}
                        onChange={e => setFormData({...formData, reading_time: parseInt(e.target.value) || 5})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* English Side */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4" dir="ltr">
                  <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" /> English Content
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title (H1) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={e => setFormData({...formData, title_en: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-gray-900 text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description <span className="text-red-500">*</span></label>
                    <textarea
                      rows={2}
                      required
                      value={formData.excerpt_en}
                      onChange={e => setFormData({...formData, excerpt_en: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-700 text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Content (Markdown Supported) <span className="text-red-500">*</span></label>
                    <textarea
                      rows={12}
                      required
                      value={formData.content_en}
                      onChange={e => setFormData({...formData, content_en: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm leading-relaxed text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category_en}
                      onChange={e => setFormData({...formData, category_en: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-left"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  حفظ المقال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
