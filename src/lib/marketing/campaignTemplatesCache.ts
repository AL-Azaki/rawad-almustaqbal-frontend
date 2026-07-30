import { ApiClient } from '../api';

let cachedTemplates: any[] | null = null;
let fetchPromise: Promise<any[]> | null = null;

export const fetchCachedTemplates = async (forceRefresh = false): Promise<any[]> => {
  if (forceRefresh) {
    cachedTemplates = null;
    fetchPromise = null;
  }

  if (cachedTemplates) {
    return cachedTemplates;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = ApiClient.get<any[]>('/marketing-campaign-templates')
    .then(res => {
      cachedTemplates = res.data || [];
      fetchPromise = null;
      return cachedTemplates;
    })
    .catch(err => {
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
};
