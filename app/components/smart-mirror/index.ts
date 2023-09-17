import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { convertSettings } from 'smart-mirror-desktop/helpers/settings-converter';
import { Settings } from 'smart-mirror-desktop/models/settings';
import AutoUpdater from 'smart-mirror-desktop/services/auto-updater';
import StoreService from 'smart-mirror-desktop/services/store-service';
import { wait } from 'smart-mirror-desktop/utils/utils';

interface SmartMirrorArgs {
  onSave: () => void;
  onCancel: () => void;
}

const DEFAULT_FONT_SIZE = '19px';

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

  get newsWidgetStyle() {
    const width = `width: ${this.settings?.newsWidget.width}px`;

    return htmlSafe(width);
  }

  constructor(owner: any, args: SmartMirrorArgs) {
    super(owner, args);

    const load = async () => {
      // wait for server to boot up
      while (!(await this.storeService.isServerAlive())) {
        await wait(500);
      }

      const settings = await this.storeService.getAppSettings();
      this.settings = convertSettings(settings);
      this.handleSettingsSave();
      this.autoUpdater.startCheckingForUpdates();
    };

    load();
  }

  @action
  updateFontSize() {
    const root = document.documentElement;
    const rootFontSize = root.style.getPropertyValue('--root-font-size');

    if (rootFontSize !== this.settings?.layout.fontSize) {
      root.style.setProperty(
        '--root-font-size',
        this.settings?.layout.fontSize ?? DEFAULT_FONT_SIZE
      );
    }
  }

  @action
  handleSettingsUpdate(settings: Settings) {
    console.log(settings);

    this.settings = settings;
  }

  @action
  handleSettingsSave() {
    if (this.settings) {
      this.storeService.setAppSettings(this.settings);
    }
  }
}
