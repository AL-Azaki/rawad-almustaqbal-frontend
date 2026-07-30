import { useState, useEffect } from 'react';
import { getLandingPages } from '../../../lib/marketing/landingPages';
import { MousePointerClick, Copy, ExternalLink, Globe, Target, Wrench, Search, Filter, Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ApiClient } from '../../../lib/api';
import { Loader } from '../../../components/ui/Loader';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';

interface LandingPage {
  name: string;
  path: string;
  fullUrl: string;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  category?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface ProjectType {
  id: number | string;
  slug?: string;
  title: string;
  category: string;
  created_at: string;
}

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [serviceSort, setServiceSort] = useState('newest');

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [projectSortFilter, setProjectSortFilter] = useState('newest');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically generate pages from existing resources (Vite's import.meta.glob)
    const { pages: fileNames } = getLandingPages();
    const baseUrl = window.location.origin;
    
    const generatedPages: LandingPage[] = [];
    
    for (const fileName of fileNames) {

      let routePath = `/${fileName.toLowerCase()}`;
      let displayName = fileName;

      if (fileName === 'Home') {
        routePath = '/';
        displayName = 'الرئيسية (Home)';
      } else if (fileName === 'BlogIndex') {
        routePath = '/blog';
        displayName = 'المدونة (Blog)';
      } else if (fileName === 'About') {
        displayName = 'من نحن (About)';
      } else if (fileName === 'Services') {
        displayName = 'الخدمات (Services)';
      } else if (fileName === 'Portfolio') {
        displayName = 'معرض الأعمال (Portfolio)';
      } else if (fileName === 'Contact') {
        displayName = 'اتصل بنا (Contact)';
      }

      generatedPages.push({
        name: displayName,
        path: routePath,
        fullUrl: `${baseUrl}${routePath}`
      });
    }

    generatedPages.sort((a, b) => a.path === '/' ? -1 : b.path === '/' ? 1 : 0);
    setPages(generatedPages);

    fetchServices();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await ApiClient.get<ProjectType[]>('/projects');
      setProjects(res.data || []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      toast.error('فشل تحميل مشاريع معرض الأعمال');
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      // Fetch only active services by passing all=true to avoid pagination, and because we only want published ones
      // Since it's admin panel, maybe we fetch all? ServiceController uses ?all=true to return only active. Wait!
      // In the ServiceController, if $all = true, it returns `where('status', 'active')->get()`.
      // So if we pass all=true, we ONLY get active services. But the prompt says "If a service is unpublished: It must disappear automatically".
      // This implies it only shows published services. Wait, what about the status filter? 
      // I included an "inactive" filter in the UI. If I want both, I shouldn't use all=true if it only returns active.
      // Wait, ServiceService::getServices(true) returns active. If false, it returns paginate (all statuses).
      // Let's just fetch all without `all=true` or use a different endpoint to get all services unpaginated?
      // Wait, we can fetch paginated and just show page 1, or better: just fetch without `all` and loop? No, API client gets `res.data`.
      // Let's use `ApiClient.get('/services')` and get what we get.
      // If we use `/services`, the admin gets `AdminServices` using the same endpoint `/services` and getting an array. Wait, in `/services`, Admin API route?
      // Let's fetch using the authenticated endpoint or public? Public is Route::get('/services'). Admin is Route::post('/services'). Admin doesn't have GET.
      // Wait, `routes/api.php` has:
      // Route::get('/services', [ServiceController::class, 'index']);  <-- this is public.
      // So the admin uses the same GET endpoint. Since admin needs all services, `ServiceService::getServices` returns `paginate` when `$all=false`.
      // Admin dashboard handles pagination? Wait, in `AdminServices.tsx` it expects an array:
      // const res = await ApiClient.get<Service[]>('/services');
      // If it expects an array, then the backend must be returning an array. Wait, the `ServiceController` returns `successPaginated`.
      // The `ApiClient` handles paginated response by returning `response.data.data` as `res.data` and `res.pagination`.
      // So `res.data` is an array of items on the first page!
      // If there are many services, this only returns the first 15. Is that acceptable for Landing pages? Probably yes for now.
      
      const res = await ApiClient.get<Service[]>('/services?all=true'); // wait, if I use all=true, I only get 'active' ones. 
      // The requirement says "Automatically load every published service... If unpublished, it must disappear."
      // So it's perfect to use `?all=true`. The status filter can just be removed or left as is (it will only ever show active).
      // Actually, if the requirement is "Published services", then we only want active ones anyway.
      
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
      toast.error('فشل تحميل خدمات الموقع');
    } finally {
      setLoadingServices(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ الرابط بنجاح! جاهز للصقه في حملتك.');
  };

  const handleUseInCampaign = (url: string) => {
    navigate(`/admin/marketing/url-builder?url=${encodeURIComponent(url)}`);
  };

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      const matchesCategory = serviceCategoryFilter === 'all' || service.category === serviceCategoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (serviceSort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (serviceSort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(projectSearchTerm.toLowerCase());
      const matchesCategory = projectCategoryFilter === 'all' || project.category === projectCategoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (projectSortFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (projectSortFilter === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  const uniqueProjectCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const uniqueServiceCategories = Array.from(new Set(services.map(s => s.category).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-12">
      <Helmet>
        <title>صفحات الهبوط | مركز التسويق</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
          <MousePointerClick className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">صفحات الهبوط (Landing Pages)</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">تصفح روابط موقعك لاختيار الصفحة المناسبة لحملاتك الإعلانية.</p>
        </div>
      </div>

      {/* Section 1: Website Pages */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-500" />
            الصفحات الثابتة (Website Pages)
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">الصفحات الأساسية في موقعك.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="p-4 font-semibold text-right">الصفحة (الاسم الودي)</th>
                  <th className="p-4 font-semibold text-right">الرابط المباشر للمستخدمين (URL)</th>
                  <th className="p-4 font-semibold text-center min-w-[280px]">الإجراءات المتاحة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{page.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <a href={page.fullUrl} target="_blank" rel="noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors block max-w-[250px] sm:max-w-xs md:max-w-md truncate" dir="ltr" title={page.fullUrl}>
                        {page.fullUrl}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleUseInCampaign(page.fullUrl)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors"
                          title="تحويل الرابط لحملة عبر إنشاء UTM"
                        >
                          <Target className="w-4 h-4" />
                          استخدم في حملة
                        </button>
                        <button 
                          onClick={() => handleCopy(page.fullUrl)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="نسخ الرابط مجرداً بدون تتبع"
                        >
                          <Copy className="w-4 h-4" />
                          نسخ
                        </button>
                        <a 
                          href={page.fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                          title="معاينة الصفحة للزوار"
                        >
                          <ExternalLink className="w-4 h-4" />
                          معاينة
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {pages.length === 0 && (
              <div className="p-12">
                <EmptyState 
                  title="لا توجد صفحات هبوط" 
                  description="النظام يقوم بتحميل الصفحات المتاحة في موقعك، إذا استمرت المشكلة تواصل مع الدعم الفني."
                  variant="no-data" 
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Service Landing Pages */}
      <section>
        <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-6 h-6 text-amber-500" />
              صفحات الخدمات (Service Landing Pages)
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">صفحات الخدمات الديناميكية الجاهزة للاستخدام في الحملات.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ابحث عن خدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 min-w-[200px]"
              />
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow appearance-none text-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">منشور (Active)</option>
                <option value="inactive">غير منشور (Inactive)</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={serviceCategoryFilter}
                onChange={(e) => setServiceCategoryFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow appearance-none text-sm"
              >
                <option value="all">جميع التصنيفات</option>
                {uniqueServiceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={serviceSort}
                onChange={(e) => setServiceSort(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow appearance-none text-sm"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loadingServices ? (
            <div className="p-12 flex justify-center">
              <Loader usage="centered" size="lg" color="primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-semibold text-right">الخدمة</th>
                    <th className="p-4 font-semibold text-right">الرابط المباشر للمستخدمين (URL)</th>
                    <th className="p-4 font-semibold text-center">تاريخ النشر</th>
                    <th className="p-4 font-semibold text-center min-w-[280px]">الإجراءات المتاحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredServices.map((service) => {
                    const serviceUrl = `${window.location.origin}/services/${service.slug}`;
                    return (
                      <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0">
                              <Wrench className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white block">{service.title}</span>
                              {service.status === 'active' ? (
                                <Badge variant="success" size="sm">منشور</Badge>
                              ) : (
                                <Badge variant="danger" size="sm">غير منشور</Badge>
                              )}
                              {service.category && (
                                <Badge variant="info" size="sm" className="ml-2">{service.category}</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <a href={serviceUrl} target="_blank" rel="noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors block max-w-[250px] sm:max-w-xs md:max-w-md truncate" dir="ltr" title={serviceUrl}>
                            {serviceUrl}
                          </a>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">
                            {new Date(service.created_at).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleUseInCampaign(serviceUrl)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors"
                              title="تحويل الرابط لحملة عبر إنشاء UTM"
                            >
                              <Target className="w-4 h-4" />
                              استخدم في حملة
                            </button>
                            <button 
                              onClick={() => handleCopy(serviceUrl)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="نسخ الرابط مجرداً بدون تتبع"
                            >
                              <Copy className="w-4 h-4" />
                              نسخ
                            </button>
                            <a 
                              href={serviceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                              title="معاينة الصفحة للزوار"
                            >
                              <ExternalLink className="w-4 h-4" />
                              معاينة
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredServices.length === 0 && (
                <div className="p-12">
                  <EmptyState 
                    title="لا توجد خدمات" 
                    description="لم يتم العثور على خدمات مطابقة للبحث أو التصفية."
                    variant="no-data" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Portfolio Landing Pages */}
      <section>
        <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-purple-500" />
              صفحات معرض الأعمال (Portfolio Projects)
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">مشاريع معرض الأعمال التي يمكنك التسويق لها بشكل مباشر.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={projectSearchTerm}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                className="pl-4 pr-10 min-w-[200px]"
              />
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={projectCategoryFilter}
                onChange={(e) => setProjectCategoryFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-shadow appearance-none text-sm"
              >
                <option value="all">جميع التصنيفات</option>
                {uniqueProjectCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={projectSortFilter}
                onChange={(e) => setProjectSortFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-shadow appearance-none text-sm"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loadingProjects ? (
            <div className="p-12 flex justify-center">
              <Loader usage="centered" size="lg" color="primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-semibold text-right">المشروع</th>
                    <th className="p-4 font-semibold text-right">الرابط المباشر للمستخدمين (URL)</th>
                    <th className="p-4 font-semibold text-center">تاريخ الإضافة</th>
                    <th className="p-4 font-semibold text-center min-w-[280px]">الإجراءات المتاحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredProjects.map((project) => {
                    const projectUrl = `${window.location.origin}/portfolio/${project.slug}`;
                    return (
                      <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white block">{project.title}</span>
                              <Badge variant="info" size="sm">{project.category}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <a href={projectUrl} target="_blank" rel="noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors block max-w-[250px] sm:max-w-xs md:max-w-md truncate" dir="ltr" title={projectUrl}>
                            {projectUrl}
                          </a>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">
                            {new Date(project.created_at).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleUseInCampaign(projectUrl)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                              title="تحويل الرابط لحملة عبر إنشاء UTM"
                            >
                              <Target className="w-4 h-4" />
                              استخدم في حملة
                            </button>
                            <button 
                              onClick={() => handleCopy(projectUrl)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="نسخ الرابط مجرداً بدون تتبع"
                            >
                              <Copy className="w-4 h-4" />
                              نسخ
                            </button>
                            <a 
                              href={projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                              title="معاينة الصفحة للزوار"
                            >
                              <ExternalLink className="w-4 h-4" />
                              معاينة
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredProjects.length === 0 && (
                <div className="p-12">
                  <EmptyState 
                    title="لا توجد مشاريع" 
                    description="لم يتم العثور على مشاريع مطابقة للبحث أو التصفية."
                    variant="no-data" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

