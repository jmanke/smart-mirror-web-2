import Service, { inject as service } from '@ember/service';
import { Settings } from 'smart-mirror-desktop/models/settings';
import ApiService from './api-service';

const BASE_URL = 'http://localhost:5001/api';

export default class StoreService extends Service {
  @service declare apiService: ApiService;

  async isServerAlive() {
    try {
      return !!(await this.apiService.getRequest(`${BASE_URL}/health`));
    } catch (e: any) {
      return false;
    }
  }

  async getAppSettings() {
    return this.apiService.getRequest<Settings>(`${BASE_URL}/settings`);
  }

  async setAppSettings(settings: Settings) {
    try {
      return this.apiService.put(`${BASE_URL}/settings`, settings);
    } catch (err) {
      console.error(err);

      return null;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'store-service': StoreService;
  }
}
