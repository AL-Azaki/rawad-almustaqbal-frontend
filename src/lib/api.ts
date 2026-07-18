import axios from 'axios';
import toast from 'react-hot-toast';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 45000, // 45 seconds timeout (to handle slow DB connections)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle global errors centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('لا يمكن الاتصال بالخادم. تأكد من اتصال الإنترنت.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    // 401 Unauthorized
    if (status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    } 
    // 403 Forbidden
    else if (status === 403) {
      toast.error(data.message || 'غير مصرح لك بتنفيذ هذه العملية.');
    } 
    // 419 CSRF Token Mismatch
    else if (status === 419) {
      toast.error('انتهت صلاحية الجلسة. يرجى تحديث الصفحة.');
    } 
    // 422 Validation Error
    else if (status === 422) {
      // Typically handled by forms, but we can show a generic toast if needed
      // toast.error(data.message || 'بيانات غير صالحة.');
    } 
    // 500 Internal Server Error
    else if (status >= 500) {
      toast.error('حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً.');
    }

    return Promise.reject(error);
  }
);

export const ApiClient = {
  async get<T>(url: string, params = {}): Promise<{ data: T, pagination?: any, message: string }> {
    const response = await api.get(url, { params });
    return {
      data: response.data.data !== undefined ? response.data.data : response.data,
      pagination: response.data.pagination,
      message: response.data.message
    };
  },
  
  async post<T>(url: string, data: any, config = {}): Promise<{ data: T, message: string }> {
    const response = await api.post(url, data, config);
    return {
      data: response.data.data !== undefined ? response.data.data : response.data,
      message: response.data.message
    };
  },

  async put<T>(url: string, data: any, config = {}): Promise<{ data: T, message: string }> {
    const response = await api.put(url, data, config);
    return {
      data: response.data.data !== undefined ? response.data.data : response.data,
      message: response.data.message
    };
  },

  async patch<T>(url: string, data: any, config = {}): Promise<{ data: T, message: string }> {
    const response = await api.patch(url, data, config);
    return {
      data: response.data.data !== undefined ? response.data.data : response.data,
      message: response.data.message
    };
  },

  async delete(url: string): Promise<{ message: string }> {
    const response = await api.delete(url);
    return {
      message: response.data.message
    };
  }
};

export default api;
