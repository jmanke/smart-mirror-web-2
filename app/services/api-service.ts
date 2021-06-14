import Service from '@ember/service';
import axios from 'axios';

export default class ApiService extends Service {
  async getRequest<T>(url: string): Promise<T | null> {
    return axios.get<T>(url).then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    });
  }

  async put<T>(url: string, data: T) {
    return axios.put<T>(url, data);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'api-service': ApiService;
  }
}
