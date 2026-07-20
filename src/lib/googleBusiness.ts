export interface GoogleBusinessConfig {
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  googlePlaceId?: string;
  googleEnableUtmTracking?: string;
}

class GoogleBusinessService {
  private appendUTM(url: string, campaign: string = 'gbp_local'): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('utm_source', 'google');
      urlObj.searchParams.set('utm_medium', 'organic');
      urlObj.searchParams.set('utm_campaign', campaign);
      return urlObj.toString();
    } catch (e) {
      // If URL parsing fails, just return the original URL
      return url;
    }
  }

  getGoogleMapsUrl(config: GoogleBusinessConfig): string {
    let url = config.googleMapsUrl || 'https://maps.google.com';
    if (config.googleEnableUtmTracking === '1' || config.googleEnableUtmTracking === 'true') {
      url = this.appendUTM(url);
    }
    return url;
  }

  getGoogleReviewUrl(config: GoogleBusinessConfig): string {
    let url = config.googleReviewUrl || 'https://g.page/review';
    if (config.googleEnableUtmTracking === '1' || config.googleEnableUtmTracking === 'true') {
      url = this.appendUTM(url, 'gbp_reviews');
    }
    return url;
  }

  openGoogleMaps(config: GoogleBusinessConfig): void {
    const url = this.getGoogleMapsUrl(config);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openGoogleReview(config: GoogleBusinessConfig): void {
    const url = this.getGoogleReviewUrl(config);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const googleBusinessService = new GoogleBusinessService();
