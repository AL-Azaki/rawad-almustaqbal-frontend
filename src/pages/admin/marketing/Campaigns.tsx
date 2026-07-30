import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Megaphone, Trash2, Edit2, Copy, CopyCheck, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ApiClient } from '../../../lib/api';
import { fetchCachedTemplates } from '../../../lib/marketing/campaignTemplatesCache';
import { Loader } from '../../../components/ui/Loader';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';

interface CampaignTemplate {
  id: number;
  name: string;
  platform: 'google_ads' | 'meta_ads' | 'instagram_ads' | 'tiktok_ads' | 'snapchat_ads' | 'other';
  headline: string | null;
  description: string | null;
  cta: string | null;
  keywords: string | null;
  notes: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

const platforms = {
  google_ads: 'إعلانات جوجل (Google Ads)',
  meta_ads: 'إعلانات ميتا (فيسبوك/انستقرام)',
  tiktok_ads: 'إعلانات تيك توك (TikTok)',
  snapchat_ads: 'إعلانات سناب شات (Snapchat)',
  other: 'منصات أخرى'
};

export default function Campaigns() {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    platform: 'google_ads',
    headline: '',
    description: '',
    cta: '',
    keywords: '',
    notes: '',
    status: true
  });

  const fetchTemplates = async (forceRefresh = false) => {
    try {
      const data = await fetchCachedTemplates(forceRefresh);
      setTemplates(data);
    } catch (e) {
      toast.error('حدث خطأ أثناء جلب القوالب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const toggleStatus = async (template: CampaignTemplate) => {
    const newStatus = !template.status;
    try {
      await ApiClient.put(`/marketing-campaign-templates/${template.id}`, {
        ...template,
        status: newStatus
      });
      fetchTemplates(true);
      toast.success(newStatus ? 'تم تفعيل القالب' : 'تم تعطيل القالب');
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await ApiClient.delete(`/marketing-campaign-templates/${deleteConfirmId}`);
      toast.success('تم حذف القالب بنجاح');
      setDeleteConfirmId(null);
      fetchTemplates(true);
    } catch (error: any) {
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم القالب');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await ApiClient.put(`/marketing-campaign-templates/${editingId}`, formData);
        toast.success('تم تعديل القالب بنجاح');
      } else {
        await ApiClient.post('/marketing-campaign-templates', formData);
        toast.success('تم إضافة القالب بنجاح');
      }
      fetchTemplates(true);
      setShowForm(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ القالب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (template: CampaignTemplate) => {
    setFormData({
      name: template.name,
      platform: template.platform,
      headline: template.headline || '',
      description: template.description || '',
      cta: template.cta || '',
      keywords: template.keywords || '',
      notes: template.notes || '',
      status: template.status
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const copyToClipboard = (text: string | null, label: string) => {
    if (!text) {
      toast.error(`لا يوجد نص لنسخه في ${label}`);
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} بنجاح`);
  };

  const copyAll = (template: CampaignTemplate) => {
    const text = `العنوان: ${template.headline || 'لا يوجد'}
النص الإعلاني: ${template.description || 'لا يوجد'}
الإجراء المكتوب (CTA): ${template.cta || 'لا يوجد'}
الكلمات المفتاحية: ${template.keywords || 'لا يوجد'}
ملاحظات: ${template.notes || 'لا يوجد'}`;
    
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ كافة تفاصيل القالب بنجاح');
  };

  // Group templates by platform
  const groupedTemplates = Object.keys(platforms).reduce((acc, platform) => {
    const platformTemplates = templates.filter(t => t.platform === platform || (platform === 'meta_ads' && t.platform === 'instagram_ads'));
    if (platformTemplates.length > 0) acc[platform] = platformTemplates;
    return acc;
  }, {} as Record<string, CampaignTemplate[]>);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await ApiClient.post('/marketing-campaign-templates/seed', {});
      toast.success('تم تحميل القوالب الافتراضية بنجاح');
      fetchTemplates(true);
    } catch (e) {
      toast.error('حدث خطأ أثناء تحميل القوالب الافتراضية');
      setLoading(false);
    }
  };

  if (loading && templates.length === 0) {
    return <div className="h-64 flex items-center justify-center"><Loader usage="centered" size="lg" color="primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <Helmet>
        <title>قوالب الحملات | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">قوالب الحملات (Campaign Templates)</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">جهّز نصوص إعلاناتك وانسخها مباشرة عند إطلاق الحملة</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => fetchTemplates(true)} className="flex-1 sm:flex-none">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" /> تحديث
          </Button>
          <Button variant="primary" onClick={() => { setEditingId(null); setFormData({ name: '', platform: 'google_ads', headline: '', description: '', cta: '', keywords: '', notes: '', status: true }); setShowForm(true); }} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" /> إضافة قالب
          </Button>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} size="lg">
        <Modal.Header onClose={() => setShowForm(false)}>{editingId ? 'تعديل القالب' : 'إضافة قالب جديد'}</Modal.Header>
        <Modal.Body>
          <form id="templateForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">اسم القالب (للمرجع الداخلي فقط)</label>
                <Input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثال: إعلان خصم اليوم الوطني" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">المنصة الإعلانية</label>
                <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value as any})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow">
                  {Object.entries(platforms).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">العنوان الرئيسي للإعلان (Headline)</label>
              <Input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="السطر الأول الذي سيجذب العميل..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">النص الإعلاني (Description)</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="تفاصيل العرض، المميزات، ولماذا يجب عليهم اختيار خدمتك..." rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">دعوة اتخاذ الإجراء النصية (CTA)</label>
                <Input type="text" value={formData.cta} onChange={e => setFormData({...formData, cta: e.target.value})} placeholder="مثال: اطلب استشارتك الآن" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">الكلمات المفتاحية (للاستهداف)</label>
                <Input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} placeholder="تسويق، عقارات، تصميم..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ملاحظات لفريق إطلاق الحملة</label>
              <Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="أي ملاحظات حول الميزانية أو الجمهور المستهدف..." rows={2} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">حالة القالب</h4>
                <p className="text-xs text-gray-500">هل هذا القالب جاهز ومتاح للاستخدام؟</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.status} onChange={(e) => setFormData({...formData, status: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setShowForm(false)}>تراجع</Button>
            <Button type="submit" form="templateForm" loading={submitting}>حفظ القالب</Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} size="sm">
        <Modal.Body className="text-center pt-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <Trash2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">حذف القالب</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">هل أنت متأكد من حذف هذا القالب نهائياً؟</p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>تراجع</Button>
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>تأكيد الحذف</Button>
          </div>
        </Modal.Body>
      </Modal>

      {Object.keys(groupedTemplates).length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Megaphone className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا يوجد قوالب حملات مخصصة حتى الآن</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            ليس لديك أي قوالب مخصصة حتى الآن. 
            تتوفر قوالب احترافية جاهزة لمساعدتك في البدء بإطلاق حملاتك الإعلانية على مختلف المنصات بسرعة وسهولة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleSeed} variant="outline">استعراض القوالب الافتراضية</Button>
            <Button onClick={() => { setEditingId(null); setShowForm(true); }} variant="primary">
              <Plus className="w-4 h-4 mr-2" /> إنشاء قالب جديد
            </Button>
          </div>
        </div>
      )}

      {Object.entries(groupedTemplates).map(([platform, platformTemplates]) => (
        <div key={platform} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{platforms[platform as keyof typeof platforms]}</h2>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-bold">{platformTemplates.length} قالب</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platformTemplates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative flex flex-col transition-all hover:shadow-md">
                
                {/* Header Actions */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${template.status ? 'bg-green-500' : 'bg-red-500'}`} title={template.status ? 'مهيأ ومتاح' : 'معطل'}></span>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{template.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <button onClick={() => toggleStatus(template)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors" title="إيقاف / تفعيل">
                      <div className={`w-6 h-3.5 rounded-full flex items-center px-0.5 transition-colors ${template.status ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${template.status ? 'translate-x-0' : '-translate-x-2.5'}`}></div>
                      </div>
                    </button>
                    <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1"></div>
                    <button onClick={() => handleEdit(template)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="تعديل"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteClick(template.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors" title="حذف"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 space-y-6">
                  {/* Headline */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">العنوان الرئيسي</span>
                      <button onClick={() => copyToClipboard(template.headline, 'العنوان')} className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 px-2 py-1 rounded transition-colors"><Copy className="w-3 h-3" /> نسخ</button>
                    </div>
                    <div className="text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 min-h-[3rem] flex items-center">
                      {template.headline || <span className="text-gray-400 font-normal italic">لم يحدد</span>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">النص الإعلاني</span>
                      <button onClick={() => copyToClipboard(template.description, 'النص الإعلاني')} className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 px-2 py-1 rounded transition-colors"><Copy className="w-3 h-3" /> نسخ</button>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap min-h-[5rem]">
                      {template.description || <span className="text-gray-400 italic">لم يحدد</span>}
                    </div>
                  </div>

                  {/* CTA & Keywords */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500">الإجراء (CTA)</span>
                        <button onClick={() => copyToClipboard(template.cta, 'الإجراء')} className="text-gray-400 hover:text-amber-500"><Copy className="w-3 h-3" /></button>
                      </div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{template.cta || '-'}</div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500">الكلمات المفتاحية</span>
                        <button onClick={() => copyToClipboard(template.keywords, 'الكلمات المفتاحية')} className="text-gray-400 hover:text-amber-500"><Copy className="w-3 h-3" /></button>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{template.keywords || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/10">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    تم التحديث: <span dir="ltr">{new Date(template.updated_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <button 
                    onClick={() => copyAll(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg text-sm font-bold hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-colors"
                  >
                    <CopyCheck className="w-4 h-4" />
                    نسخ الكل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

