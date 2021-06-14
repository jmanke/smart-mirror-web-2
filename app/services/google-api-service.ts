import Service, { inject as service } from '@ember/service';
import ApiService from './api-service';

export interface GetEventsProps {
  maxResults?: number;
  timeMin?: Date;
  timeMax?: Date;
}

export interface GetTasksProps {
  maxResults?: number;
}

const BASE_URL = 'http://localhost:5001';

export default class GoogleApiService extends Service {
  @service declare apiService: ApiService;

  async getEvents({ maxResults = 10, timeMin, timeMax }: GetEventsProps) {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
    });
    if (timeMin) {
      params.append('timeMin', timeMin.toISOString());
    }
    if (timeMax) {
      params.append('timeMax', timeMax.toISOString());
    }

    return this.apiService.getRequest<[]>(`${BASE_URL}/gapi/events?${params}`);
  }

  async getTasks({ maxResults = 10 }: GetEventsProps) {
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
    });

    return this.apiService.getRequest<[]>(`${BASE_URL}/gapi/tasks?${params}`);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'google-api-service': GoogleApiService;
  }
}
