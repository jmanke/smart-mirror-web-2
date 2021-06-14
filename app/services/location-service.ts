import Service, { inject as service } from '@ember/service';
import Api from './api-service';

export interface Location {
  longitude: string;
  latitude: string;
}

export default class LocationService extends Service {
  @service declare apiService: Api;

  private location: any;

  async getLocation() {
    if (!this.location) {
      this.location = await this.apiService.getRequest(
        'https://geolocation-db.com/json/'
      );
    }

    return this.location as Location;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'location-service': LocationService;
  }
}
