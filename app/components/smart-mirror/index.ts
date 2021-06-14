import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { Settings } from 'smart-mirror-desktop/models/settings';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import StoreService from 'smart-mirror-desktop/services/store-service';
import { htmlSafe } from '@ember/string';
import { wait } from 'smart-mirror-desktop/utils/utils';

interface SmartMirrorArgs {
  onSave: () => void;
  onCancel: () => void;
}

export default class SmartMirror extends Component<SmartMirrorArgs> {
  @service declare storeService: StoreService;

  @tracked
  settings: Settings | undefined | null;

  get topMargin() {
    return `top-${this.settings?.profile.margin.top}`;
  }

  get profileMarginStyle() {
    const top = `top: ${this.settings?.profile.margin.top}px`;
    const right = `right: ${this.settings?.profile.margin.right}px`;
    const left = `left: ${this.settings?.profile.margin.left}px`;
    const bottom = `bottom: ${this.settings?.profile.margin.bottom}px`;

    const style = `${top}; ${right}; ${left}; ${bottom}`;

    return htmlSafe(style);
  }

  constructor(owner: any, args: SmartMirrorArgs) {
    super(owner, args);

    const load = async () => {
      // wait for server to boot up
      while (!(await this.storeService.isServerAlive())) {
        await wait(500);
      }

      this.settings = await this.storeService.getAppSettings();

      if (!this.settings) {
        const defaultSettings: Settings = {
          profile: {
            margin: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
            stockSymbol: 'AMC',
          },
        };

        this.settings = defaultSettings;
        this.handleSettingsSave();
      }
    };

    load();
  }

  @action
  handleSettingsUpdate(settings: Settings) {
    this.settings = settings;
  }

  @action
  handleSettingsSave() {
    if (this.settings) {
      this.storeService.setAppSettings(this.settings);
    }
  }
}
