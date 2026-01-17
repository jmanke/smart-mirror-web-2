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
  updateCity(e: Event) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      city: (e.target as HTMLInputElement).value,
    });
  }

  @action
  updateState(e: Event) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      state: (e.target as HTMLInputElement).value,
    });
  }

  @action
  updateCountry(e: Event) {
    this.args.onUpdateLocation?.({
      ...this.args.location,
      country: (e.target as HTMLInputElement).value,
    });
  }
}
