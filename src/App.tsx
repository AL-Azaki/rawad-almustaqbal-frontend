import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';

// Lazy Load Public Secondary Pages
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const CaseStudyDetailPage = React.lazy(() => import('./pages/CaseStudyDetailPage'));
const Contact = React.lazy(() => import('./pages/Contact'));
const BlogIndex = React.lazy(() => import('./pages/BlogIndex'));
const BlogArticleDetail = React.lazy(() => import('./pages/BlogArticleDetail'));

// Lazy Load PWA Prompt to separate framer-motion chunk
const InstallPrompt = React.lazy(() => import('./components/pwa/InstallPrompt'));

// Lazy Load Admin Pages
const AuthLayout = React.lazy(() => import('./layouts/AuthLayout'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = React.lazy(() => import('./pages/admin/Orders'));
const AdminProjects = React.lazy(() => import('./pages/admin/Projects'));
const AdminServices = React.lazy(() => import('./pages/admin/Services'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const AdminTestimonials = React.lazy(() => import('./pages/admin/Testimonials'));
const AdminBlogPosts = React.lazy(() => import('./pages/admin/BlogPosts'));

// Loading Fallbacks
const AdminFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
  </div>
);

const PublicFallback = () => (
  <div className="min-h-[60vh] bg-transparent flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
  </div>
);

// Wrapper for public lazy routes
const LazyPublicRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PublicFallback />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <BrowserRouter>

      <Suspense fallback={null}>
        <InstallPrompt />
      </Suspense>

      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<LazyPublicRoute><About /></LazyPublicRoute>} />
          <Route path="services" element={<LazyPublicRoute><Services /></LazyPublicRoute>} />
          <Route path="services/:slug" element={<LazyPublicRoute><ServiceDetailPage /></LazyPublicRoute>} />
          <Route path="portfolio" element={<LazyPublicRoute><Portfolio /></LazyPublicRoute>} />
          <Route path="portfolio/:id" element={<LazyPublicRoute><CaseStudyDetailPage /></LazyPublicRoute>} />
          <Route path="blog" element={<LazyPublicRoute><BlogIndex /></LazyPublicRoute>} />
          <Route path="blog/:slug" element={<LazyPublicRoute><BlogArticleDetail /></LazyPublicRoute>} />
          <Route path="contact" element={<LazyPublicRoute><Contact /></LazyPublicRoute>} />
        </Route>

        {/* Auth Routes */}
        <Route 
          path="/admin/login" 
          element={
            <Suspense fallback={<AdminFallback />}>
              <AuthLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminLogin />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="blog" element={<AdminBlogPosts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;