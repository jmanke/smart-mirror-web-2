import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Settings, Profile } from 'smart-mirror-desktop/models/settings';

interface SettingsIndexArgs {
  settings: Settings;
  // eslint-disable-next-line no-unused-vars
  onUpdate: (settings: Settings) => void;
  onSave: () => void;
}

export default class SettingsIndex extends Component<SettingsIndexArgs> {
  @tracked
  showSettingsButton = false;
  @tracked
  showSettingsModal = false;
  prevProfile: Profile | undefined;

  get profile() {
    return this.args.settings.profile;
  }

  set profile(profile: Profile) {
    this.args.onUpdate?.({
      ...this.args.settings,
      profile,
    });
  }

  @action
  mouseMoved() {
    if (!this.showSettingsButton) {
      this.showSettingsButton = true;

      setTimeout(() => {
        this.showSettingsButton = false;
      }, 3000);
    }
  }

  @action
  async showSettings() {
    this.prevProfile = { ...this.args.settings.profile };

    this.showSettingsModal = true;
    this.showSettingsButton = false;
  }

  @action
  handleConfirm() {
    this.args.onSave?.();
    this.showSettingsModal = false;
  }

  @action
  handleClose() {
    this.handleConfirm();
  }

  @action
  stopPropogation(e: Event) {
    e.stopPropagation();
  }
}
