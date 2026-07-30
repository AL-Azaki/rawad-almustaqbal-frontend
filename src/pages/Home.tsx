import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import api, { ApiClient } from '../lib/api';

import { HeroSection } from '../components/sections/home/HeroSection';
import { ServicesSection } from '../components/sections/home/ServicesSection';
import { ProcessSection } from '../components/sections/home/ProcessSection';
import { ProjectsSection, type ProjectType } from '../components/sections/home/ProjectsSection';
import { TestimonialsSection, type TestimonialType } from '../components/sections/home/TestimonialsSection';
import { FeaturesSection } from '../components/sections/home/FeaturesSection';
import { EmergencyCTA } from '../components/sections/home/EmergencyCTA';
import { ReviewModal } from '../components/sections/home/ReviewModal';
import { FAQSection } from '../components/sections/home/FAQSection';

export default function Home() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  
  // Projects State
  const [projects, setProjects] = useState<ProjectType[]>(() => {
    const cached = localStorage.getItem('home_projects');
    return cached ? JSON.parse(cached) : [];
  });
  const [loadingProjects, setLoadingProjects] = useState(!projects.length);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(() => {
    const cached = localStorage.getItem('home_testimonials');
    return cached ? JSON.parse(cached) : [];
  });
  const [loadingTestimonials, setLoadingTestimonials] = useState(!testimonials.length);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch Projects
    ApiClient.get<ProjectType[]>('/projects')
      .then(res => {
        const latestProjects = res.data.slice(0, 8);
        setProjects(latestProjects);
        localStorage.setItem('home_projects', JSON.stringify(latestProjects));
        setLoadingProjects(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProjects(false);
      });

    // Fetch Approved Testimonials
    api.get('/testimonials')
      .then(response => {
        setTestimonials(response.data);
        localStorage.setItem('home_testimonials', JSON.stringify(response.data));
        setLoadingTestimonials(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingTestimonials(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>
          {settings?.siteName || 'العزكي تك'} | حلول تقنية وكهربائية وصيانة في جدة وجميع مناطق المملكة
        </title>
        <meta
          name="description"
          content={
            settings?.siteDescription ||
            "شركة العزكي تك المتكاملة في جدة وجميع مناطق المملكة، مع تغطية مباشرة لجميع مناطق المملكة وجميع مناطق المملكة. متخصصون في تأسيس المنازل الذكية، وتركيب كاميرات المراقبة، وأنظمة السنترال، وتمديد الشبكات والألياف الضوئية، والصيانة الكهربائية والتقنية بأعلى معايير الجودة والضمان."
          }
        />
        <meta
          name="keywords"
          content={t(
            'home.keywords',
            'العزكي تك, حلول تقنية جدة, حلول تقنية جميع مناطق المملكة, جميع مناطق المملكة, جميع مناطق المملكة, جميع مناطق المملكة, سمارت هوم جدة, كاميرات مراقبة جميع مناطق المملكة, شبكات جميع مناطق المملكة, كهربائي جدة, شمال جدة'
          )}
        />
        <link rel="canonical" href={`${window.location.origin}/`} />
        <meta property="og:title" content={`${settings?.siteName || 'العزكي تك'} | حلول تقنية وكهربائية وصيانة في جدة وجميع مناطق المملكة`} />
        <meta property="og:description" content={settings?.siteDescription || "شركة العزكي تك المتكاملة في جدة وجميع مناطق المملكة."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <HeroSection />

      <ServicesSection />

      <ProcessSection />

      <ProjectsSection projects={projects} loading={loadingProjects} />

      <TestimonialsSection
        testimonials={testimonials}
        loading={loadingTestimonials}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <FAQSection />

      <FeaturesSection />

      <EmergencyCTA />

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

