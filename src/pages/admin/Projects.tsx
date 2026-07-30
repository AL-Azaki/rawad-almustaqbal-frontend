import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, MapPin, Clock, Video, Layers, CheckCircle2, AlertCircle, Wrench, FileText, UploadCloud, FileVideo, X } from 'lucide-react';
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
import LocationAutocompleteField from '../../components/common/LocationAutocompleteField';
import { PORTFOLIO_CATEGORIES } from '../../data/portfolioCaseStudies';

interface Project {
  id: number;
  slug?: string;
  title: string;
  category: string;
  location_district?: string;
  image_path: string | null;
  raw_image_path?: string | null;
  description: string;
  challenge_solution_text?: string;
  duration?: string;
  installed_equipment?: any[] | null;
  video_url?: string | null;
  video_path?: string | null;
  raw_video_path?: string | null;
  before_image_path?: string | null;
  raw_before_image_path?: string | null;
  after_image_path?: string | null;
  raw_after_image_path?: string | null;
  updated_at?: string;
}

interface EquipmentItem {
  id: string;
  ar: string;
  en: string;
}

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  // Active section tab in modal
  const [activeTab, setActiveTab] = useState<'basic' | 'case_study' | 'equipment' | 'media'>('basic');

  // Upload modes for Cover, Before, After, and Video
  const [uploadModes, setUploadModes] = useState<{
    cover: 'link' | 'file';
    before: 'link' | 'file';
    after: 'link' | 'file';
    video: 'link' | 'file';
  }>({
    cover: 'file',
    before: 'link',
    after: 'link',
    video: 'link',
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: PORTFOLIO_CATEGORIES[0].key,
    location_district: '',
    description: '',
    challenge: '',
    solution: '',
    duration: '',
    video_url: '',
    video_path: '',
    image_url: '',
    before_image_path: '',
    after_image_path: '',
  });

  // File objects
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);

  const handleDropFile = (e: React.DragEvent, field: 'cover' | 'before' | 'after' | 'video') => {
    e.preventDefault();
    setDragOverField(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (field === 'cover') setImageFile(file);
    else if (field === 'before') setBeforeFile(file);
    else if (field === 'after') setAfterFile(file);
    else if (field === 'video') setVideoFile(file);
  };

  // Dynamic Equipment List state
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get<Project[]>('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      toast.error('فشل تحميل المشاريع ودراسات الحالة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await ApiClient.delete(`/projects/${deleteConfirmId}`);
      setProjects(projects.filter(p => p.id !== deleteConfirmId));
      toast.success(res.message || 'تم حذف المشروع بنجاح');
    } catch (error) {
      console.error('Failed to delete project', error);
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Equipment helpers
  const handleAddEquipment = () => {
    setEquipmentList([...equipmentList, { id: `${Date.now()}-${Math.random()}`, ar: '', en: '' }]);
  };

  const handleRemoveEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const handleEquipmentChange = (index: number, field: 'ar' | 'en', value: string) => {
    const updated = [...equipmentList];
    updated[index][field] = value;
    setEquipmentList(updated);
  };

  const handleMoveEquipment = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === equipmentList.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...equipmentList];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setEquipmentList(updated);
  };

  // Helper to parse challenge_solution_text
  const parseChallengeSolution = (text?: string | null) => {
    if (!text) return { challenge: '', solution: '' };
    if (text.includes('### التحدي الفني') && text.includes('### الحل الهندسي')) {
      const parts = text.split('### الحل الهندسي');
      const challengePart = parts[0]
        .replace('### التحدي الفني والوضع السابق للموقع:', '')
        .replace('### التحدي الفني:', '')
        .trim();
      const solutionPart = parts[1]
        ? parts[1]
            .replace('والمنهجية المتبعة:', '')
            .replace('ومن منهجية العمل:', '')
            .replace('ومنهجية العمل:', '')
            .replace(':', '')
            .trim()
        : '';
      return { challenge: challengePart, solution: solutionPart };
    }
    return { challenge: text, solution: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category.trim());
      data.append('description', formData.description.trim());
      data.append('slug', formData.slug.trim());

      if (formData.location_district.trim()) {
        data.append('location_district', formData.location_district.trim());
      }
      if (formData.duration.trim()) {
        data.append('duration', formData.duration.trim());
      }
      // Cover Image
      if (uploadModes.cover === 'file') {
        if (imageFile) data.append('image', imageFile);
        else if (editingId && !formData.image_url) data.append('image_url', '');
      } else {
        data.append('image_url', formData.image_url.trim());
      }

      // Before Image
      if (uploadModes.before === 'file') {
        if (beforeFile) data.append('before_image', beforeFile);
        else if (editingId && !formData.before_image_path) data.append('before_image_path', '');
      } else {
        data.append('before_image_path', formData.before_image_path.trim());
      }

      // After Image
      if (uploadModes.after === 'file') {
        if (afterFile) data.append('after_image', afterFile);
        else if (editingId && !formData.after_image_path) data.append('after_image_path', '');
      } else {
        data.append('after_image_path', formData.after_image_path.trim());
      }

      // Video (dual mode support)
      if (uploadModes.video === 'file') {
        if (videoFile) data.append('video', videoFile);
        else if (editingId && !formData.video_path) data.append('video_path', '');
        if (formData.video_url !== undefined) data.append('video_url', formData.video_url.trim());
      } else {
        data.append('video_url', formData.video_url.trim());
        if (editingId && !formData.video_path) data.append('video_path', '');
      }

      if (editingId) {
        const res = await ApiClient.post(`/projects/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(res.message || 'تم تحديث المشروع بنجاح');
      } else {
        const res = await ApiClient.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(res.message || 'تم إضافة المشروع بنجاح');
      }

      resetAndCloseForm();
      fetchProjects();
    } catch (error: any) {
      console.error('Failed to save project', error);
      toast.error(error?.message || 'حدث خطأ أثناء حفظ المشروع');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    const { challenge, solution } = parseChallengeSolution(project.challenge_solution_text);

    // Normalize equipment array
    let eqItems: EquipmentItem[] = [];
    if (project.installed_equipment && Array.isArray(project.installed_equipment)) {
      eqItems = project.installed_equipment.map((item, idx) => {
        if (typeof item === 'string') {
          return { id: `eq-${idx}-${Date.now()}`, ar: item, en: item };
        }
        if (typeof item === 'object' && item !== null) {
          return {
            id: `eq-${idx}-${Date.now()}`,
            ar: item.ar || item.title || item.name || '',
            en: item.en || item.title || item.name || '',
          };
        }
        return { id: `eq-${idx}-${Date.now()}`, ar: String(item), en: String(item) };
      });
    }

    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || PORTFOLIO_CATEGORIES[0].key,
      location_district: project.location_district || '',
      description: project.description || '',
      challenge: challenge,
      solution: solution,
      duration: project.duration || '',
      video_url: project.video_url || '',
      video_path: project.raw_video_path || project.video_path || '',
      image_url: project.raw_image_path || project.image_path || '',
      before_image_path: project.raw_before_image_path || project.before_image_path || '',
      after_image_path: project.raw_after_image_path || project.after_image_path || '',
    });
    setSlugEdited(!!project.slug);

    setEquipmentList(eqItems);

    const isVideoFile = !!project.video_path || (project.video_url && (
      project.video_url.startsWith('/storage') ||
      project.video_url.includes('/videos/') ||
      project.video_url.endsWith('.mp4') ||
      project.video_url.endsWith('.mov') ||
      project.video_url.endsWith('.webm')
    ));

    setUploadModes({
      cover: project.image_path && (project.raw_image_path?.startsWith('projects/') || project.image_path.includes('/storage')) ? 'file' : 'link',
      before: project.before_image_path && (project.raw_before_image_path?.startsWith('projects/') || project.before_image_path.includes('/storage')) ? 'file' : 'link',
      after: project.after_image_path && (project.raw_after_image_path?.startsWith('projects/') || project.after_image_path.includes('/storage')) ? 'file' : 'link',
      video: isVideoFile ? 'file' : 'link',
    });

    setEditingId(project.id);
    setActiveTab('basic');
    setShowForm(true);
  };

  const resetAndCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setSlugEdited(false);
    setActiveTab('basic');
    setFormData({
      title: '',
      slug: '',
      category: PORTFOLIO_CATEGORIES[0].key,
      location_district: '',
      description: '',
      challenge: '',
      solution: '',
      duration: '',
      video_url: '',
      video_path: '',
      image_url: '',
      before_image_path: '',
      after_image_path: '',
    });
    setImageFile(null);
    setBeforeFile(null);
    setAfterFile(null);
    setVideoFile(null);
    setEquipmentList([]);
    setUploadModes({ cover: 'file', before: 'link', after: 'link', video: 'link' });
  };

  if (loading && projects.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader usage="centered" size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{t('admin.nav.projects')} | {t('admin.dashboard')}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('admin.projects.title', 'إدارة المشاريع ودراسات الحالة')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            المصدر الوحيد للحقيقة (SSOT) لإدارة المحتوى المعماري، تفاصيل التحدي والحل الهندسي، والمواصفات الفنية للمشاريع.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={fetchProjects}
            className="flex-1 sm:flex-none"
            aria-label={t('admin.projects.refreshBtn')}
          >
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.projects.refreshBtn', 'تحديث')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetAndCloseForm();
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none"
            aria-label={t('admin.projects.addBtn')}
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.projects.addBtn', 'إضافة مشروع جديد')}
          </Button>
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      <Modal open={showForm} onClose={resetAndCloseForm} size="xl">
        <Modal.Header onClose={resetAndCloseForm}>
          {editingId ? 'تعديل مشروع وتفاصيل دراسة الحالة' : 'إضافة مشروع جديد ودراسة حالة هندسية'}
        </Modal.Header>
        <Modal.Body className="p-6">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'basic'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>المعلومات الأساسية والموقع</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('case_study')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'case_study'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>التحدي والحل الهندسي (اختياري)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'equipment'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>التجهيزات والمواصفات (اختياري)</span>
              {equipmentList.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full font-extrabold">{equipmentList.length}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'media'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>الوسائط والتوثيق (قبل وبعد)</span>
            </button>
          </div>

          <form id="projectForm" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: BASIC INFO & LOCATION */}
            <div className={activeTab === 'basic' ? 'space-y-5 block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="project-title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    عنوان المشروع <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="project-title"
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
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
                    }}
                    placeholder="مثال: مشروع أتمتة وحلول تحكم مركزي (Smart Home) لفيلا خاصة"
                  />
                </div>
                <div>
                  <label htmlFor="project-category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    التصنيف الفني <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="project-category"
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                  >
                    {PORTFOLIO_CATEGORIES.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="project-slug" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    الرابط الصديق لمحركات البحث (Slug) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="project-slug"
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => {
                      setSlugEdited(true);
                      setFormData({ ...formData, slug: e.target.value });
                    }}
                    placeholder="مثال: smart-home-villa-al-marjan"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-400 mt-1">يتم توليده تلقائياً من العنوان، ويمكنك تعديله يدوياً.</p>
                </div>
                <div>
                  <LocationAutocompleteField
                    id="project-location"
                    value={formData.location_district}
                    onChange={val => setFormData({ ...formData, location_district: val })}
                    required={false}
                    label="الحي والمنطقة (اختياري، يظهر بالشارات ومحركات البحث)"
                    placeholder="مثال: حي المرجان، جميع مناطق المملكة، جدة"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="project-duration" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    مدة التنفيذ والإنجاز (اختياري)
                  </label>
                  <Input
                    id="project-duration"
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="مثال: 3 أسابيع عمل ميداني"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="project-desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  الوصف العام للمشروع <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="project-desc"
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="نبذة عامة أو وصف موجز ومفصل عن طبيعة المشروع وما تم إنجازه للعميل..."
                  rows={4}
                />
              </div>
            </div>

            {/* TAB 2: CASE STUDY CHALLENGE & SOLUTION */}
            <div className={activeTab === 'case_study' ? 'space-y-6 block' : 'hidden'}>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p leading-relaxed>
                  <strong>ملاحظة هامة:</strong> الحقول أدناه اختيارية تماماً. في حال إدخالها ستظهر كدراسة حالة هندسية مفصلة في صفحة المقال الفني. إذا تركتها فارغة، فسيقوم الموقع بإخفاء الأقسام تلقائياً دون أي فراغات أو أخطاء في التصميم.
                </p>
              </div>

              <div>
                <label htmlFor="project-challenge" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  التحدي الفني والوضع السابق للموقع (Challenge - اختياري)
                </label>
                <Textarea
                  id="project-challenge"
                  value={formData.challenge}
                  onChange={e => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="اشرح العقبات الفنية أو المشاكل المعمارية والكهربائية التي كان يعاني منها المالك قبل تدخل العزكي تك..."
                  rows={5}
                />
              </div>

              <div>
                <label htmlFor="project-solution" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  الحل الهندسي المنفذ ومنهجية العمل (Engineering Solution - اختياري)
                </label>
                <Textarea
                  id="project-solution"
                  value={formData.solution}
                  onChange={e => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="اشرح بالتفصيل المنهجية والخطوات الفنية التي اتبعها فريق المهندسين لحل المشاكل وتنفيذ النظام وفق الكود المعتمد..."
                  rows={5}
                />
              </div>
            </div>

            {/* TAB 3: INSTALLED EQUIPMENT LIST */}
            <div className={activeTab === 'equipment' ? 'space-y-5 block' : 'hidden'}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">إدارة التجهيزات والمواصفات المعتمدة</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    أضف ورتب الأجهزة، الكابلات، واللوحات المثبتة بالمشروع. تظهر كجدول أنيق للمواصفات.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddEquipment}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  إضافة جهاز / مواصفة جديدة
                </Button>
              </div>

              {equipmentList.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-bold mb-1">لم يتم إضافة أي تجهيزات بعد</p>
                  <p className="text-xs">اضغط على زر "إضافة جهاز / مواصفة جديدة" للبدء في بناء القائمة ديناميكياً.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {equipmentList.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xs">
                          {index + 1}
                        </span>
                        <div className="flex sm:flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveEquipment(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-20 disabled:pointer-events-none"
                            title="نقل للأعلى"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveEquipment(index, 'down')}
                            disabled={index === equipmentList.length - 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-20 disabled:pointer-events-none"
                            title="نقل للأسفل"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                        <div>
                          <Input
                            type="text"
                            value={item.ar}
                            onChange={e => handleEquipmentChange(index, 'ar', e.target.value)}
                            placeholder="اسم ومواصفة الجهاز بالعربية..."
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={item.en}
                            onChange={e => handleEquipmentChange(index, 'en', e.target.value)}
                            placeholder="English Specification (Optional)..."
                            className="text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(index)}
                        className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shrink-0 self-end sm:self-center"
                        title="حذف المواصفة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAB 4: MEDIA & DOCUMENTATION */}
            <div className={activeTab === 'media' ? 'space-y-6 block' : 'hidden'}>
              {/* Cover Image */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                  <label className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-500" />
                    <span>الصورة الرئيسية للمشروع (Cover Image)</span>
                  </label>
                  <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setUploadModes({ ...uploadModes, cover: 'file' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        uploadModes.cover === 'file'
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      رفع ملف من الجهاز
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadModes({ ...uploadModes, cover: 'link' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        uploadModes.cover === 'link'
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      رابط خارجي (URL)
                    </button>
                  </div>
                </div>

                {uploadModes.cover === 'file' ? (
                  <div>
                    {imageFile || (formData.image_url && uploadModes.cover === 'file') ? (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {imageFile ? imageFile.name : 'الصورة الرئيسية المحفوظة'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB` : 'صورة محملة على السيرفر'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <label className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl cursor-pointer transition-colors">
                              استبدال
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setFormData({ ...formData, image_url: '' });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                              title="حذف الصورة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 max-h-48 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          <img
                            src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                            alt="Cover preview"
                            className="w-full max-h-48 object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOverField('cover'); }}
                        onDragLeave={() => setDragOverField(null)}
                        onDrop={e => handleDropFile(e, 'cover')}
                        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                          dragOverField === 'cover'
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-gray-300 dark:border-gray-700 hover:border-amber-500/60 bg-white/50 dark:bg-gray-800/30'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setImageFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                          اضغط لاختيار صورة من الجهاز أو اسحب الملف وأفلته هنا
                        </p>
                        <p className="text-xs text-gray-400">
                          يدعم اختيار الصور مباشرة من الهاتف أو الحاسوب (PNG, JPG, WEBP)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    dir="ltr"
                  />
                )}
              </div>

              {/* Before & After Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Before Image */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span>صورة الوضع السابق (Before Image - اختياري)</span>
                    </label>
                    <div className="flex gap-1 bg-white dark:bg-gray-900 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setUploadModes({ ...uploadModes, before: 'file' })}
                        className={`px-2 py-0.5 rounded font-bold ${
                          uploadModes.before === 'file' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        ملف
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadModes({ ...uploadModes, before: 'link' })}
                        className={`px-2 py-0.5 rounded font-bold ${
                          uploadModes.before === 'link' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        رابط
                      </button>
                    </div>
                  </div>

                  {uploadModes.before === 'file' ? (
                    <div>
                      {beforeFile || (formData.before_image_path && uploadModes.before === 'file') ? (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                              {beforeFile ? beforeFile.name : 'صورة قبل المحفوظة'}
                            </span>
                            <div className="flex gap-1">
                              <label className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                                استبدال
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => setBeforeFile(e.target.files?.[0] || null)}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => { setBeforeFile(null); setFormData({ ...formData, before_image_path: '' }); }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <img
                            src={beforeFile ? URL.createObjectURL(beforeFile) : formData.before_image_path}
                            alt="Before preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div
                          onDragOver={e => { e.preventDefault(); setDragOverField('before'); }}
                          onDragLeave={() => setDragOverField(null)}
                          onDrop={e => handleDropFile(e, 'before')}
                          className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                            dragOverField === 'before' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30'
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setBeforeFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">اختر أو اسحب صورة الوضع السابق</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      type="url"
                      value={formData.before_image_path}
                      onChange={e => setFormData({ ...formData, before_image_path: e.target.value })}
                      placeholder="رابط صورة قبل التنفيذ..."
                      dir="ltr"
                      className="text-xs"
                    />
                  )}
                </div>

                {/* After Image */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>صورة الوضع المنفذ (After Image - اختياري)</span>
                    </label>
                    <div className="flex gap-1 bg-white dark:bg-gray-900 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setUploadModes({ ...uploadModes, after: 'file' })}
                        className={`px-2 py-0.5 rounded font-bold ${
                          uploadModes.after === 'file' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        ملف
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadModes({ ...uploadModes, after: 'link' })}
                        className={`px-2 py-0.5 rounded font-bold ${
                          uploadModes.after === 'link' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        رابط
                      </button>
                    </div>
                  </div>

                  {uploadModes.after === 'file' ? (
                    <div>
                      {afterFile || (formData.after_image_path && uploadModes.after === 'file') ? (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                              {afterFile ? afterFile.name : 'صورة بعد المحفوظة'}
                            </span>
                            <div className="flex gap-1">
                              <label className="px-2 py-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                                استبدال
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => setAfterFile(e.target.files?.[0] || null)}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => { setAfterFile(null); setFormData({ ...formData, after_image_path: '' }); }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <img
                            src={afterFile ? URL.createObjectURL(afterFile) : formData.after_image_path}
                            alt="After preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div
                          onDragOver={e => { e.preventDefault(); setDragOverField('after'); }}
                          onDragLeave={() => setDragOverField(null)}
                          onDrop={e => handleDropFile(e, 'after')}
                          className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                            dragOverField === 'after' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30'
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setAfterFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">اختر أو اسحب صورة بعد التنفيذ</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      type="url"
                      value={formData.after_image_path}
                      onChange={e => setFormData({ ...formData, after_image_path: e.target.value })}
                      placeholder="رابط صورة بعد الإنجاز..."
                      dir="ltr"
                      className="text-xs"
                    />
                  )}
                </div>
              </div>

              {/* Video Section (Dual-Mode: File & URL) */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                  <label className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-500" />
                    <span>فيديو المشروع التوثيقي (Video - اختياري)</span>
                  </label>
                  <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setUploadModes({ ...uploadModes, video: 'file' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                        uploadModes.video === 'file'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <FileVideo className="w-3.5 h-3.5" />
                      رفع فيديو من الجهاز / الهاتف
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadModes({ ...uploadModes, video: 'link' })}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        uploadModes.video === 'link'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      رابط خارجي (YouTube / Vimeo / مباشر)
                    </button>
                  </div>
                </div>

                {uploadModes.video === 'file' ? (
                  <div>
                    {videoFile || (formData.video_path && uploadModes.video === 'file') || (formData.video_url && uploadModes.video === 'file') ? (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                              <FileVideo className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {videoFile ? videoFile.name : 'فيديو المشروع المحفوظ حالياً'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB • جاهز للرفع` : 'فيديو محمل على السيرفر'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <label className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl cursor-pointer transition-colors">
                              استبدال
                              <input
                                type="file"
                                accept="video/mp4,video/quicktime,video/mov,video/webm"
                                onChange={e => setVideoFile(e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setVideoFile(null);
                                setFormData({ ...formData, video_path: '', video_url: '' });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                              title="حذف الفيديو"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Video Preview */}
                        <div className="relative rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          <video
                            src={videoFile ? URL.createObjectURL(videoFile) : (formData.video_path || formData.video_url)}
                            controls
                            className="w-full max-h-64 object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOverField('video'); }}
                        onDragLeave={() => setDragOverField(null)}
                        onDrop={e => handleDropFile(e, 'video')}
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                          dragOverField === 'video'
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-gray-300 dark:border-gray-700 hover:border-amber-500/60 bg-white/50 dark:bg-gray-800/30'
                        }`}
                      >
                        <input
                          type="file"
                          accept="video/mp4,video/quicktime,video/mov,video/webm"
                          onChange={e => setVideoFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                          اضغط لاختيار فيديو من الجهاز أو اسحب الملف وأفلته هنا
                        </p>
                        <p className="text-xs text-gray-400">
                          يدعم الرفع المباشر من معرض الهاتف والجوال (صيغ: MP4, MOV, WEBM حتى 100 ميجابايت)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Input
                      id="project-video-url"
                      type="url"
                      value={formData.video_url}
                      onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://youtube.com/... أو رابط فيديو مباشر .mp4"
                      dir="ltr"
                    />
                    <p className="text-xs text-gray-400 mt-1">يُمكنك لصق رابط YouTube أو Vimeo أو أي فيديو مستضاف خارجياً.</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-gray-400">
              {activeTab === 'basic' && 'الخطوة 1 من 4: الأساسيات والموقع'}
              {activeTab === 'case_study' && 'الخطوة 2 من 4: التحدي والحل الهندسي'}
              {activeTab === 'equipment' && 'الخطوة 3 من 4: التجهيزات والمواصفات'}
              {activeTab === 'media' && 'الخطوة 4 من 4: الوسائط والتوثيق'}
            </span>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetAndCloseForm}>
                {t('admin.projects.modal.cancel', 'إلغاء')}
              </Button>
              <Button type="submit" form="projectForm" loading={submitting}>
                {editingId ? 'حفظ التعديلات' : t('admin.projects.modal.submit', 'إضافة المشروع')}
              </Button>
            </div>
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
            هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>إلغاء</Button>
            <Button variant="danger" className="flex-1" onClick={confirmDelete}>نعم، احذف</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const getImageUrl = (path: string | null) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            const cacheBuster = typeof project.updated_at === 'string' ? new Date(project.updated_at).getTime() : project.id;
            if (path.startsWith('/storage')) {
              const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
              return `${baseUrl}${path}?v=${cacheBuster}`;
            }
            return path;
          };
          const imageUrl = getImageUrl(project.image_path);
          const videoUrl = getImageUrl(project.video_path || project.video_url || null);
          const activeMedia = imageUrl || videoUrl;
          const isVideo = (activeMedia && /\.(mp4|webm|ogg|mov)$/i.test(activeMedia.split('?')[0])) || (!imageUrl && !!videoUrl);

          return (
            <div key={project.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="h-56 bg-gray-100 dark:bg-gray-900 relative overflow-hidden group/media">
                {activeMedia ? (
                  isVideo ? (
                    <video src={activeMedia} controls playsInline className="w-full h-full object-contain bg-black" />
                  ) : (
                    <img src={activeMedia} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )
                ) : null}

                <div className={`w-full h-full flex flex-col items-center justify-center text-gray-400 ${activeMedia ? 'hidden' : 'flex'}`}>
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-600 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  <span className="text-sm font-medium">{(t('portfolio.comingSoon') || 'No Image')}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>

                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                  <Badge variant="primary" className="shadow-sm backdrop-blur border border-amber-100 dark:border-amber-900/30">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {project.location_district && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{project.location_district}</span>
                  </div>
                )}

                <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  {project.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Case study indicators */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  {project.duration && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{project.duration}</span>
                    </span>
                  )}
                  {project.installed_equipment && Array.isArray(project.installed_equipment) && project.installed_equipment.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{project.installed_equipment.length} تجهيزات</span>
                    </span>
                  )}
                  {project.challenge_solution_text && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-bold">
                      <Wrench className="w-3 h-3" />
                      <span>دراسة فنية</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="flex-1 !bg-blue-50 hover:!bg-blue-100 !border-transparent !text-blue-600 dark:!bg-blue-900/20 dark:hover:!bg-blue-900/40 dark:!text-blue-400 text-sm"
                    aria-label={`تعديل مشروع ${project.title}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    تعديل ودراسة الحالة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(project.id)}
                    className="flex-1 !bg-red-50 hover:!bg-red-100 !border-transparent !text-red-600 dark:!bg-red-900/20 dark:hover:!bg-red-900/40 dark:!text-red-400 text-sm"
                    aria-label={`حذف مشروع ${project.title}`}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && projects.length === 0 && (
          <div className="col-span-full">
            <EmptyState title={t('admin.projects.empty') || 'لا توجد مشاريع أو دراسات حالة'} variant="no-data" />
          </div>
        )}
      </div>
    </div>
  );
}

