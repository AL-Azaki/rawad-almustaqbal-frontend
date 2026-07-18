import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, Search, Eye, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { ApiClient } from '../../lib/api';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge, type BadgeVariant } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  location: string;
  service_id: number;
  service?: { title: string };
  description: string;
  status: 'new' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

const getStatusMap = (t: any) => ({
  new: { label: t('admin.orders.status.new'), variant: 'info' as BadgeVariant, icon: AlertCircle },
  pending: { label: t('admin.orders.status.pending'), variant: 'warning' as BadgeVariant, icon: Clock },
  in_progress: { label: t('admin.orders.status.in_progress'), variant: 'primary' as BadgeVariant, icon: RefreshCw },
  completed: { label: t('admin.orders.status.completed'), variant: 'success' as BadgeVariant, icon: CheckCircle },
  cancelled: { label: t('admin.orders.status.cancelled'), variant: 'danger' as BadgeVariant, icon: XCircle },
});

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setRefreshing(true);
    if (orders.length === 0) setLoading(true);
    try {
      const res = await ApiClient.get<Order[]>('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await ApiClient.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus as any } : order));
      toast.success(res.message);
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(t('admin.orders.statusError', 'حدث خطأ أثناء تحديث الحالة'));
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchLower) || 
      order.phone.includes(searchLower) ||
      (order.service?.title || '').toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  const statusMap = getStatusMap(t);

  if (loading && orders.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader usage="centered" size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{t('admin.nav.orders')} | {t('admin.dashboard')}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.orders.title')}</h1>
        <Button 
          variant="outline" 
          onClick={fetchOrders} 
          disabled={refreshing}
          aria-label={t('admin.orders.refresh')}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" /> 
          {refreshing ? t('admin.orders.refreshing') : t('admin.orders.refresh')}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div 
          className="flex w-full md:w-auto gap-2 overflow-x-auto pb-1 no-scrollbar" 
          role="group" 
          aria-label="تصفية الطلبات حسب الحالة"
        >
          {['all', 'new', 'pending', 'in_progress', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${filter === status ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {status === 'all' ? t('admin.orders.filterAll', 'الكل') : statusMap[status as keyof typeof statusMap].label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <label htmlFor="search-orders" className="sr-only">{t('admin.orders.searchPlaceholder', 'بحث بالاسم أو الجوال...')}</label>
          <Input 
            id="search-orders"
            type="text" 
            placeholder={t('admin.orders.searchPlaceholder', 'بحث بالاسم أو الجوال...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {!refreshing && filteredOrders.length === 0 ? (
            <EmptyState title={t('admin.orders.empty')} variant="no-data" />
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusMap[order.status].icon;
              return (
                <div key={order.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">#{order.id}</span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mt-1">{order.customer_name}</h3>
                    </div>
                    <Badge variant={statusMap[order.status].variant}>
                      <StatusIcon className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      {statusMap[order.status].label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-600 dark:text-amber-500">{order.service?.title || 'خدمة غير محددة'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400" aria-hidden="true">📍</span>
                      {order.location}
                    </div>
                    <div className="flex items-center gap-2" dir="ltr">
                      <span className="text-gray-400" aria-hidden="true">📱</span>
                      {order.phone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                      aria-label="عرض تفاصيل الطلب"
                    >
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    </button>
                    
                    <a href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" aria-label={`تواصل مع ${order.customer_name} عبر واتساب`} className="flex-1 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 text-green-700 dark:text-green-400 text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      {t('admin.orders.actions.whatsapp')}
                    </a>
                    
                    <div className="flex-1 flex items-center gap-2">
                      {updating === order.id ? (
                        <div className="flex-1 flex justify-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div>
                      ) : (
                        <select 
                          aria-label="تغيير حالة الطلب"
                          className="w-full text-xs border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700 dark:text-white py-2"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          <option value="new">{t('admin.orders.status.new')}</option>
                          <option value="pending">{t('admin.orders.status.pending')}</option>
                          <option value="in_progress">{t('admin.orders.status.in_progress')}</option>
                          <option value="completed">{t('admin.orders.status.completed')}</option>
                          <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right" dir={t('admin.orders.title') === 'Orders Management' ? 'ltr' : 'rtl'}>
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold whitespace-nowrap">{t('admin.orders.table.orderId')}</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">{t('admin.orders.table.customer')}</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">{t('admin.orders.table.service')}</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">{t('admin.orders.table.date')}</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">{t('admin.orders.table.status')}</th>
                <th className="px-6 py-4 font-bold text-center whitespace-nowrap">{t('admin.orders.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {!refreshing && filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState title={t('admin.orders.empty')} variant="no-data" />
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusMap[order.status].icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white text-start">#{order.id}</td>
                      <td className="px-6 py-4 text-start">
                        <div className="font-bold text-gray-900 dark:text-white">{order.customer_name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1" dir="ltr">{order.phone}</div>
                        <a href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" aria-label={`تواصل مع ${order.customer_name} عبر واتساب`} className="text-green-600 dark:text-green-400 text-xs hover:underline mt-1 inline-block font-bold">
                          {t('admin.orders.actions.whatsapp')}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-start">
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-xs font-semibold mb-1">{order.service?.title || 'خدمة غير محددة'}</span>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{order.location}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs text-start whitespace-nowrap" dir="ltr">
                        {new Date(order.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4 text-start">
                        <Badge variant={statusMap[order.status].variant}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                          {statusMap[order.status].label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-start">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                            aria-label="عرض تفاصيل الطلب"
                          >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </button>
                          
                          {updating === order.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          ) : (
                            <select 
                              aria-label="تغيير حالة الطلب"
                              className="text-xs border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700 dark:text-white"
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                            >
                              <option value="new">{t('admin.orders.status.new')}</option>
                              <option value="pending">{t('admin.orders.status.pending')}</option>
                              <option value="in_progress">{t('admin.orders.status.in_progress')}</option>
                              <option value="completed">{t('admin.orders.status.completed')}</option>
                              <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} size="lg">
        {selectedOrder && (
          <>
            <Modal.Header onClose={() => setSelectedOrder(null)}>{`تفاصيل الطلب #${selectedOrder.id}`}</Modal.Header>
            <Modal.Body className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">العميل</h4>
                  <div className="font-bold text-gray-900 dark:text-white">{selectedOrder.customer_name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusMap[selectedOrder.status].variant}>
                    {statusMap[selectedOrder.status].label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">بيانات التواصل</h4>
                  <ul className="space-y-3 mt-3">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400" aria-hidden="true">📱</span>
                      <div dir="ltr" className="text-gray-900 dark:text-white font-mono">{selectedOrder.phone}</div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400" aria-hidden="true">📍</span>
                      <div className="text-gray-900 dark:text-white">{selectedOrder.location}</div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">تفاصيل الخدمة</h4>
                  <ul className="space-y-3 mt-3">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400" aria-hidden="true">✨</span>
                      <div className="text-amber-600 dark:text-amber-500 font-bold">{selectedOrder.service?.title || 'خدمة غير محددة'}</div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-gray-400" aria-hidden="true">📅</span>
                      <div className="text-gray-900 dark:text-white" dir="ltr">{new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">وصف الطلب</h4>
                <div className="bg-amber-50/50 dark:bg-gray-900/50 p-4 rounded-xl text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap border border-amber-100 dark:border-gray-700">
                  {selectedOrder.description || 'لا يوجد وصف مضاف.'}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">تحديث الحالة السريع</h4>
                <select 
                  aria-label="تغيير حالة الطلب"
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700 dark:text-white py-3"
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  disabled={updating === selectedOrder.id}
                >
                  <option value="new">{t('admin.orders.status.new')}</option>
                  <option value="pending">{t('admin.orders.status.pending')}</option>
                  <option value="in_progress">{t('admin.orders.status.in_progress')}</option>
                  <option value="completed">{t('admin.orders.status.completed')}</option>
                  <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
                </select>
              </div>

            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-between items-center w-full gap-4">
                <a href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 text-green-700 dark:text-green-400 text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  مراسلة واتساب
                </a>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>إغلاق</Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

    </div>
  );
}
