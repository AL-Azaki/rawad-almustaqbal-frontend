import { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
// هنا 👇 تم حذف X
import { Star, CheckCircle, XCircle, Trash2, ShieldAlert, Edit, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface TestimonialType {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    is_approved: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = () => {
    setLoading(true);
    setError(null);
    ApiClient.get<TestimonialType[]>('/admin/testimonials')
      .then(res => {
        // Safe fallback in case API returns unexpected structure
        setTestimonials(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to fetch testimonials:', err);
        setError('تعذر جلب الآراء. تحقق من اتصالك أو تسجيل الدخول.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleApproval = (id: number) => {
    // Optimistic Update
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: !t.is_approved } : t));
    
    ApiClient.patch(`/testimonials/${id}/approve`, {})
      .catch(() => {
        toast.error('فشل في تغيير الحالة');
        // Revert on error
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: !t.is_approved } : t));
      });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await ApiClient.delete(`/testimonials/${deleteConfirmId}`);
      setTestimonials(prev => prev.filter(t => t.id !== deleteConfirmId));
      toast.success('تم الحذف بنجاح');
    } catch (error) {
      console.error('Failed to delete testimonial', error);
      toast.error('فشل في الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', text: '', rating: 5, is_approved: true });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: TestimonialType) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      text: testimonial.text,
      rating: testimonial.rating,
      is_approved: testimonial.is_approved
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await ApiClient.put(`/testimonials/${editingId}`, formData);
        toast.success('تم التعديل بنجاح');
        setTestimonials(prev => prev.map(t => t.id === editingId ? { ...t, ...formData } : t));
      } else {
        const res = await ApiClient.post<{ testimonial: TestimonialType }>('/testimonials', formData);
        toast.success('تمت الإضافة بنجاح');
        setTestimonials(prev => [res.data.testimonial, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader usage="centered" size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>إدارة الآراء | لوحة الإدارة</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة آراء العملاء</h1>
        <Button 
          variant="primary" 
          onClick={openAddModal}
          className="w-full sm:w-auto shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" aria-hidden="true" /> إضافة رأي جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {error ? (
          <div className="col-span-full">
            <EmptyState title={error} variant="error" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="لا توجد آراء مسجلة حتى الآن." variant="no-data" />
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 relative flex flex-col transition-all hover:shadow-lg group">
              
              {!testimonial.is_approved && (
                <div className="absolute top-0 right-0 z-10">
                  <Badge variant="warning" className="rounded-bl-2xl rounded-tr-3xl rounded-tl-none rounded-br-none py-1.5 px-4 shadow-sm border-0">
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> قيد المراجعة
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full" aria-label={`التقييم: ${testimonial.rating} من 5 نجوم`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} aria-hidden="true" />
                  ))}
                </div>
                <button 
                  onClick={() => openEditModal(testimonial)}
                  className="p-2 text-gray-400 hover:text-amber-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                  aria-label={`تعديل رأي ${testimonial.name}`}
                >
                  <Edit className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-6 flex-grow font-medium leading-loose text-lg">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-5 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-sm" aria-hidden="true">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{testimonial.role || 'عميل مميز'}</p>
                    <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
                    <p className="text-xs text-gray-400">{new Date(testimonial.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <Button
                  variant="outline"
                  onClick={() => toggleApproval(testimonial.id)}
                  className={`flex-1 !border-transparent text-sm shadow-sm ${
                    testimonial.is_approved 
                      ? '!bg-white border !border-red-200 !text-red-600 hover:!bg-red-50 dark:!bg-gray-800 dark:!border-red-900/50 dark:!text-red-400 dark:hover:!bg-red-500/10' 
                      : '!bg-emerald-500 !text-white hover:!bg-emerald-600 shadow-emerald-500/20'
                  }`}
                  aria-label={testimonial.is_approved ? `إلغاء نشر رأي ${testimonial.name}` : `نشر رأي ${testimonial.name}`}
                >
                  {testimonial.is_approved ? (
                    <><XCircle className="w-4 h-4 mr-2" aria-hidden="true" /> إلغاء النشر</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" /> الموافقة والنشر</>
                  )}
                </Button>
                <button
                  onClick={() => handleDeleteClick(testimonial.id)}
                  className="p-2.5 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 rounded-xl transition-all"
                  aria-label={`حذف رأي ${testimonial.name}`}
                >
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <Modal.Header onClose={() => setIsModalOpen(false)}>{editingId ? 'تعديل الرأي' : 'إضافة رأي جديد'}</Modal.Header>
        <Modal.Body>
          <form id="testimonialForm" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="test-name" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">الاسم <span className="text-red-500">*</span></label>
              <Input 
                id="test-name"
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="test-role" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">المسمى (اختياري)</label>
              <Input 
                id="test-role"
                type="text" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>

            <div>
              <label id="rating-label" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">التقييم</label>
              <div 
                className="flex gap-2" 
                role="radiogroup" 
                aria-labelledby="rating-label"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={star === formData.rating}
                    tabIndex={star === formData.rating ? 0 : -1}
                    aria-label={`${star} نجمة`}
                    onClick={() => setFormData({...formData, rating: star})}
                    className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full transition-transform hover:scale-110 p-1"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} 
                      aria-hidden="true" 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="test-text" className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">نص الرأي <span className="text-red-500">*</span></label>
              <Textarea 
                id="test-text"
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
              />
            </div>

            {editingId && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <input 
                  type="checkbox" 
                  id="is_approved"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({...formData, is_approved: e.target.checked})}
                  className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                />
                <label htmlFor="is_approved" className="text-gray-700 dark:text-gray-300 font-bold text-sm cursor-pointer">
                  نشر الرأي في الموقع (موافق عليه)
                </label>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button type="submit" form="testimonialForm" loading={submitting}>{editingId ? 'تعديل الرأي' : 'حفظ الرأي'}</Button>
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
            هل أنت متأكد من رغبتك في حذف هذا الرأي نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>إلغاء</Button>
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>نعم، احذف</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
