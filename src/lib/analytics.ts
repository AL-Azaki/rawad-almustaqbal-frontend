// Declare gtag globally
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Core event tracking function
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else if (import.meta.env.DEV) {
    // Fallback for debugging in development when gaId is not set
    console.debug(`[Analytics] Event: ${eventName}`, eventParams);
  }
};

export const trackOrderSubmit = (serviceName: string, location: string) => {
  trackEvent('order_submit', {
    service: serviceName,
    location: location,
  });
};

export const trackWhatsAppClick = (source: 'floating_button' | 'sticky_mobile_bar' | 'contact_page' | 'hero_section' | 'service_detail') => {
  trackEvent('whatsapp_click', {
    source: source,
  });
};

export const trackPhoneCallClick = (source: 'sticky_mobile_bar' | 'contact_page') => {
  trackEvent('phone_call_click', {
    source: source,
  });
};

export const trackCaseStudyView = (caseStudyId: string | number, title: string) => {
  trackEvent('case_study_view', {
    case_study_id: caseStudyId,
    title: title,
  });
};

export const trackLocationSelect = (location: string, source: 'geo_service_areas' | 'location_autocomplete') => {
  trackEvent('location_select', {
    location: location,
    source: source,
  });
};
