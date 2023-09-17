import { action } from '@ember/object';
import Component from '@glimmer/component';
import { LocationSettings } from 'smart-mirror-desktop/models/settings';

interface SettingsLocationSettingsArgs {
  location: LocationSettings;
  // eslint-disable-next-line no-unused-vars
  onUpdateLocation: (location: LocationSettings) => void;
}

export default class SettingsLocationSettingsIndex extends Component<SettingsLocationSettingsArgs> {
  @action
  updateCity(city: string) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      city,
    });
  }

  @action
  updateState(state: string) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      state,
    });
  }

  @action
  updateCountry(country: string) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      country,
    });
  }
}
