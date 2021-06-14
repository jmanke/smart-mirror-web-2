import Service, { inject as service } from '@ember/service';
import Api from './api-service';
import Config from 'smart-mirror-desktop/config/environment';

// eslint-disable-next-line no-undef
const API_KEY = Config.APP.OPEN_WEATHER_API_KEY;
const BASE_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const BASE_ONE_CALL_URL = 'https://api.openweathermap.org/data/2.5/onecall?';

export default class OpenWeatherApiService extends Service {
  @service declare apiService: Api;

  getCurrentWeather(
    lat: string | number,
    lon: string | number,
    units = 'imperial'
  ) {
    const completeUrl = `${BASE_CURRENT_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

    return this.apiService.getRequest(completeUrl) as any;
  }

  getDailyForecast(
    lat: string | number,
    lon: string | number,
    units = 'imperial'
  ) {
    const completeUrl = `${BASE_ONE_CALL_URL}lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=${units}`;

    return this.apiService.getRequest(completeUrl) as any;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    'open-weather-api-service': OpenWeatherApiService;
  }
}
