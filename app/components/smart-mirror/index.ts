import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { Settings } from 'smart-mirror-desktop/models/settings';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import StoreService from 'smart-mirror-desktop/services/store-service';
import { htmlSafe } from '@ember/string';
import { wait } from 'smart-mirror-desktop/utils/utils';
import AutoUpdater from 'smart-mirror-desktop/services/auto-updater';

interface SmartMirrorArgs {
  onSave: () => void;
  onCancel: () => void;
}

export default class SmartMirror extends Component<SmartMirrorArgs> {
  @service declare storeService: StoreService;
  @service declare autoUpdater: AutoUpdater;

  @tracked
  settings: Settings | undefined | null;

  get topMargin() {
    return `top-${this.settings?.layout.margin.top}`;
  }

  get profileMarginStyle() {
    const top = `top: ${this.settings?.layout.margin.top}px`;
    const right = `right: ${this.settings?.layout.margin.right}px`;
    const left = `left: ${this.settings?.layout.margin.left}px`;
    const bottom = `bottom: ${this.settings?.layout.margin.bottom}px`;

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
      this.autoUpdater.startCheckingForUpdates();

      console.log(this.settings);

      const hasAllSettings =
        this.settings &&
        this.settings.layout &&
        this.settings.layout.margin &&
        this.settings.stockWidget.showStockWidget &&
        this.settings.stockWidget.stockSymbol;

      if (!hasAllSettings) {
        const defaultSettings: Settings = {
          layout: {
            margin: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
          stockWidget: {
            stockSymbol: 'AMC',
            showStockWidget: true,
          },
        };

        this.settings = { ...defaultSettings, ...this.settings };
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
