import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import OpenWeatherApiService from 'smart-mirror-desktop/services/open-weather-api-service';
import LocationService, {
  Location,
} from 'smart-mirror-desktop/services/location-service';
import HeartBeatService, {
  HeartBeat,
} from 'smart-mirror-desktop/services/heart-beat-service';

interface WidgetsWeatherIndexArgs {}

interface CurrentWeatherData {
  currentTemp: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  wind: number;
  icon: string;
}

interface DailyWeatherData {
  id: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  date: Date;
  condition: string;
}

const weatherIcons = {
  '01d': '/icons/icons8-sun.gif', //clear sky
  '01n': '/icons/icons8-moon-and-stars-100.png', // clear night
  '02d': '/icons/icons8-partly-cloudy-day.gif', // partly cloudy day
  '02n': '/icons/icons8-night.gif', // partly cloudy night
  '03d': '/icons/icons8-cloud-100.png', // scattered clouds day
  '03n': '/icons/icons8-cloud-100.png', // scattered clouds night
  '04d': '/icons/icons8-cloud-100.png', // broken clouds day
  '04n': '/icons/icons8-cloud-100.png', // broken clouds night
  '11d': '/icons/icons8-cloud-lightning.gif', // thunderstorm
  '11n': '/icons/icons8-cloud-lightning.gif', // thunderstorm
  '09d': '/icons/icons8-light-rain.gif', // Drizzle
  '09n': '/icons/icons8-light-rain.gif', // Drizzle
  '10d': '/icons/icons8-rain.gif', // rain day
  '10n': '/icons/icons8-rain.gif', // rain night
  '13d': '/icons/icons8-light-snow.gif', // snow
  '13n': '/icons/icons8-light-snow.gif', // snow
  '50d': '/icons/icons8-haze.gif', // atmosphere
  '50n': '/icons/icons8-fog.gif', // atmosphere
};

const FORECAST_NUM = 5;

export default class WidgetsWeatherIndex extends Component<WidgetsWeatherIndexArgs> {
  @service declare openWeatherApiService: OpenWeatherApiService;
  @service declare locationService: LocationService;
  @service declare heartBeatService: HeartBeatService;

  dailyForecastHeartBeat: HeartBeat | undefined;
  currentWeatherHeartBeat: HeartBeat | undefined;

  @tracked
  dailyForecast: DailyWeatherData[] = [];
  @tracked
  currentWeather: CurrentWeatherData | undefined;
  @tracked
  isConnected = true;
  @tracked
  location: Location | undefined;

  constructor(owner: any, args: WidgetsWeatherIndexArgs) {
    super(owner, args);

    const initialize = async () => {
      this.location =  await this.locationService.getLocation();

      // current weather
      this.currentWeatherHeartBeat = this.heartBeatService.startHeartbeat(
        async () => {
          if (!this.location) {
            return;
          }

          const currentWeather =
            await this.openWeatherApiService.getCurrentWeather(
              this.location.latitude,
              this.location.longitude
            );

          this.currentWeather = {
            currentTemp: Math.round(currentWeather.main.temp),
            condition: currentWeather.weather[0].description,
            feelsLike: Math.round(currentWeather.main.feels_like),
            humidity: Math.round(currentWeather.main.humidity),
            wind: Math.round(currentWeather.wind.speed),
            //@ts-ignore
            icon: weatherIcons[currentWeather.weather[0].icon],
          };
        },
        1000 * 60 * 5,
        true
      );

      // daily forecast
      this.dailyForecastHeartBeat = this.heartBeatService.startHeartbeat(
        async () => {
          if (!this.location) {
            return;
          }

          const dailyForecast =
            await this.openWeatherApiService.getDailyForecast(
              this.location.latitude,
              this.location.longitude
            );

          if (!this.isConnected) {
            this.isConnected = true;
          }

          this.dailyForecast = dailyForecast.daily
            .slice(1, FORECAST_NUM + 1)
            .map((d: any) => this.mapDailyWeatherData(d));
        },
        1000 * 60 * 60,
        true
      );
    };

    initialize();
  }

  mapDailyWeatherData(dailyWeather: any): DailyWeatherData {
    return {
      id: `${dailyWeather.date}_${dailyWeather.temp.min}_${dailyWeather.temp.max}_${dailyWeather.weather[0].description}`,
      minTemp: Math.round(dailyWeather.temp.min),
      maxTemp: Math.round(dailyWeather.temp.max),
      // @ts-ignore
      icon: weatherIcons[dailyWeather.weather[0].icon],
      date: new Date(dailyWeather.dt * 1000),
      condition: dailyWeather.weather[0].description,
    };
  }

  willDestroy() {
    super.willDestroy();

    if (this.currentWeatherHeartBeat) {
      this.heartBeatService.stopHeartbeat(this.currentWeatherHeartBeat);
    }

    if (this.dailyForecastHeartBeat) {
      this.heartBeatService.stopHeartbeat(this.dailyForecastHeartBeat);
    }
  }
}
