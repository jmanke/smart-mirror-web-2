import Service, { inject as service } from '@ember/service';
import Api, { LOCAL_SERVER_URL } from './api-service';

interface NewsResponse {
  status: string;
  results: NewsResult[];
  totalResults: number;
}

export interface NewsResult {
  title: string;
  description: string;
}

export default class NewsApiService extends Service {
  @service declare apiService: Api;

  async getTopNews() {
    const news: NewsResponse | null = await this.apiService.getRequest(
      `${LOCAL_SERVER_URL}/news/top`
    );

    return news?.results ?? [];
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'news-api-service': NewsApiService;
  }
}
