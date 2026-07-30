import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Wrench, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ApiClient } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  starting_price: number | null;
  category?: string;
  slug: string;
  status: 'active' | 'inactive';
}

export default function AdminServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Wrench',
    starting_price: '',
    category: 'electrical',
    status: 'active'
  });

  const categoryOptions = [
    { value: 'electrical', label: 'كهرباء (Electrical)' },
    { value: 'networks', label: 'شبكات (Networks)' },
    { value: 'cctv', label: 'كاميرات مراقبة (CCTV)' },
    { value: 'access-control', label: 'أنظمة البصمة والدخول (Access Control)' },
    { value: 'smart-home', label: 'منازل ذكية (Smart Home)' },
    { value: 'lighting', label: 'ديكور وإنارة (Lighting)' },
    { value: 'plumbing', label: 'سباكة (Plumbing)' },
    { value: 'maintenance', label: 'صيانة (Maintenance)' },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get<Service[]>('/services');
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
      toast.error('فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await ApiClient.patch(`/services/${id}/status`, { status: newStatus });
      toast.success(res.message);
      fetchServices();
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('حدث خطأ أثناء تحديث حالة الخدمة');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await ApiClient.delete(`/services/${deleteConfirmId}`);
      toast.success(res.message);
      setServices(services.filter(s => s.id !== deleteConfirmId));
    } catch (error) {
      console.error('Failed to delete service', error);
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...formData,
        starting_price: formData.starting_price ? parseFloat(formData.starting_price) : null
      };
      
      if (editingId) {
        const res = await ApiClient.put(`/services/${editingId}`, data);
        toast.success(res.message);
      } else {
        const res = await ApiClient.post('/services', data);
        toast.success(res.message);
      }
      
      fetchServices();
      setShowForm(false);
      setEditingId(null);
      setSlugEdited(false);
      setFormData({ title: '', slug: '', description: '', icon: 'Wrench', starting_price: '', category: 'electrical', status: 'active' });
    } catch (error) {
      console.error('Failed to save service', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      slug: service.slug || '',
      description: service.description,
      icon: service.icon || 'Wrench',
      starting_price: service.starting_price ? service.starting_price.toString() : '',
      category: service.category || 'electrical',
      status: service.status
    });
    setSlugEdited(!!service.slug);
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!slugEdited) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData({ ...formData, title: newTitle, slug: generatedSlug });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    setFormData({ ...formData, slug: e.target.value });
  };

  if (loading && services.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader usage="centered" size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{t('admin.nav.services')} | {t('admin.dashboard')}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.services.title')}</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={fetchServices} 
            className="flex-1 sm:flex-none"
            aria-label={t('admin.services.refreshBtn')}
          >
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.services.refreshBtn')}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => { 
              setEditingId(null);
              setSlugEdited(false);
              setFormData({ title: '', slug: '', description: '', icon: 'Wrench', starting_price: '', category: 'electrical', status: 'active' }); 
              setShowForm(true); 
            }} 
            className="flex-1 sm:flex-none"
            aria-label={t('admin.services.addBtn')}
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.services.addBtn')}
          </Button>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} size="lg">
        <Modal.Header onClose={() => setShowForm(false)}>{editingId ? 'تعديل الخدمة' : t('admin.services.modal.title')}</Modal.Header>
        <Modal.Body>
          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="service-title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.nameLabel')}</label>
                <Input 
                  id="service-title" 
                  required 
                  type="text" 
                  value={formData.title} 
                  onChange={handleTitleChange} 
                  placeholder={t('admin.services.modal.namePlaceholder')} 
                />
              </div>
              <div>
                <label htmlFor="service-slug" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">الرابط الدائم (Slug)</label>
                <Input 
                  id="service-slug" 
                  required 
                  type="text" 
                  value={formData.slug} 
                  onChange={handleSlugChange} 
                  placeholder="مثال: my-service" 
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="service-price" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.priceLabel')}</label>
                <Input 
                  id="service-price" 
                  type="number" 
                  step="0.01" 
                  value={formData.starting_price} 
                  onChange={e => setFormData({...formData, starting_price: e.target.value})} 
                  placeholder="0.00" 
                  dir="ltr" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="service-icon" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.iconLabel')}</label>
                <Input 
                  id="service-icon" 
                  required 
                  type="text" 
                  value={formData.icon} 
                  onChange={e => setFormData({...formData, icon: e.target.value})} 
                  placeholder={t('admin.services.modal.iconPlaceholder')} 
                  dir="ltr" 
                />
              </div>
              <div>
                <label htmlFor="service-status" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.statusLabel')}</label>
                <select 
                  id="service-status"
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                >
                  <option value="active">{t('admin.services.status.active')}</option>
                  <option value="inactive">{t('admin.services.status.inactive')}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="service-category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">التصنيف (Category)</label>
                <select 
                  id="service-category"
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="service-desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.descLabel')}</label>
              <Textarea 
                id="service-desc" 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder={t('admin.services.modal.descPlaceholder')} 
                rows={4} 
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setShowForm(false)}>{t('admin.services.modal.cancel')}</Button>
            <Button type="submit" form="serviceForm" loading={submitting}>{t('admin.services.modal.submit')}</Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} size="sm">
        <Modal.Body className="text-center pt-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Trash2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تأكيد الحذف</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            هل أنت متأكد من رغبتك في حذف هذه الخدمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>إلغاء</Button>
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>نعم، احذف</Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
            {service.status === 'inactive' && (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <Badge variant="danger" className="shadow-sm">
                  {t('admin.services.status.hiddenBadge')}
                </Badge>
              </div>
            )}
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <Wrench className="w-6 h-6" aria-hidden="true" />
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(service.id, service.status)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${service.status === 'active' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    role="switch"
                    aria-checked={service.status === 'active'}
                    aria-label={`تفعيل الخدمة ${service.title}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${service.status === 'active' ? (t('admin.services.title') === 'Services Management' ? 'translate-x-5' : '-translate-x-5') : 'translate-x-0'}`}
                    />
                  </button>
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    aria-label={`تعديل الخدمة ${service.title}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(service.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    aria-label={`حذف الخدمة ${service.title}`}
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">{service.title}</h3>
              {service.category && (
                <div className="mb-2">
                  <Badge variant="info" size="sm">{categoryOptions.find(c => c.value === service.category)?.label?.split(' ')[0] || service.category}</Badge>
                </div>
              )}
              {service.starting_price && (
                <div className="text-green-600 dark:text-green-400 text-sm font-bold mb-3 bg-green-50 dark:bg-green-900/30 inline-block px-2 py-1 rounded w-fit">
                  {t('admin.services.startsFrom')} {service.starting_price} {t('admin.services.currency')}
                </div>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">{service.description}</p>
            </div>
          </div>
        ))}
        {!loading && services.length === 0 && (
          <div className="col-span-full">
            <EmptyState title={t('admin.services.empty') || 'لا توجد خدمات'} variant="no-data" />
          </div>
        )}
      </div>
    </div>
  );
}

