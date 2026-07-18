import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Image as ImageIcon, Trash2 } from 'lucide-react';
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

interface Project {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
  updated_at?: string;
}

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<'link' | 'file'>('file');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      toast.error('فشل تحميل المشاريع');
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
      toast.success(res.message);
    } catch (error) {
      console.error('Failed to delete project', error);
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      
      if (uploadMode === 'file' && imageFile) {
        data.append('image', imageFile);
      } else if (uploadMode === 'link' && formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      if (editingId) {
        const res = await ApiClient.post(`/projects/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success(res.message);
      } else {
        const res = await ApiClient.post('/projects', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success(res.message);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', category: '', description: '', image_url: '' });
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      category: project.category || '',
      description: project.description || '',
      image_url: project.image_path || ''
    });
    setUploadMode(project.image_path && project.image_path.startsWith('/storage') ? 'file' : 'link');
    setEditingId(project.id);
    setShowForm(true);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.projects.title')}</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={fetchProjects} 
            className="flex-1 sm:flex-none"
            aria-label={t('admin.projects.refreshBtn')}
          >
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.projects.refreshBtn')}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', category: '', description: '', image_url: '' });
              setImageFile(null);
              setShowForm(true);
            }} 
            className="flex-1 sm:flex-none"
            aria-label={t('admin.projects.addBtn')}
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('admin.projects.addBtn')}
          </Button>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} size="lg">
        <Modal.Header onClose={() => setShowForm(false)}>{editingId ? 'تعديل المشروع' : t('admin.projects.modal.title')}</Modal.Header>
        <Modal.Body>
          <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="project-title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.nameLabel')}</label>
                <Input 
                  id="project-title" 
                  required 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder={t('admin.projects.modal.namePlaceholder')} 
                />
              </div>
              <div>
                <label htmlFor="project-category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.categoryLabel')}</label>
                <Input 
                  id="project-category" 
                  required 
                  type="text" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  placeholder={t('admin.projects.modal.categoryPlaceholder')} 
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <label htmlFor="project-upload-mode" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t('admin.projects.modal.mediaLabel')}</label>
              <div id="project-upload-mode" className="flex gap-2 mb-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
                <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadMode === 'file' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('admin.projects.modal.uploadPhone')}</button>
                <button type="button" onClick={() => setUploadMode('link')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadMode === 'link' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('admin.projects.modal.uploadUrl')}</button>
              </div>

              {uploadMode === 'file' ? (
                <div>
                  <input id="project-image-file" type="file" accept="image/*,video/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 dark:file:bg-amber-900/30 file:text-amber-700 dark:file:text-amber-500 hover:file:bg-amber-100 transition-colors" />
                  <p className="text-xs text-gray-400 mt-2">{t('admin.projects.modal.fileHelp')}</p>
                </div>
              ) : (
                <div>
                  <Input 
                    id="project-image-url" 
                    type="url" 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    placeholder={t('admin.projects.modal.urlPlaceholder')} 
                    dir="ltr" 
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="project-desc" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.detailsLabel')}</label>
              <Textarea 
                id="project-desc" 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder={t('admin.projects.modal.detailsPlaceholder')} 
                rows={4} 
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setShowForm(false)}>{t('admin.projects.modal.cancel')}</Button>
            <Button type="submit" form="projectForm" loading={submitting}>{t('admin.projects.modal.submit')}</Button>
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
          const isVideo = imageUrl && /\.(mp4|webm|ogg|mov)$/i.test(imageUrl.split('?')[0]);
          
          return (
          <div key={project.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div className="h-56 bg-gray-100 dark:bg-gray-900 relative overflow-hidden group/media">
              {imageUrl ? (
                isVideo ? (
                  <video src={imageUrl} controls playsInline className="w-full h-full object-contain bg-black" onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }} />
                ) : (
                  <img src={imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }} />
                )
              ) : null}
              
              <div className={`w-full h-full flex flex-col items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : 'flex'}`}>
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
              <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                {project.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">
                {project.description}
              </p>
              
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50">
                <Button 
                  variant="outline"
                  onClick={() => handleEdit(project)} 
                  className="flex-1 !bg-blue-50 hover:!bg-blue-100 !border-transparent !text-blue-600 dark:!bg-blue-900/20 dark:hover:!bg-blue-900/40 dark:!text-blue-400 text-sm"
                  aria-label={`تعديل مشروع ${project.title}`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> 
                  تعديل
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
            <EmptyState title={t('admin.projects.empty') || 'لا توجد مشاريع'} variant="no-data" />
          </div>
        )}
      </div>
    </div>
  );
}
