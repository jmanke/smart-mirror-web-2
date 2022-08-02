import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  Settings,
  Layout,
  StockWidget,
  NewsWidget,
  GoogleWidget,
} from 'smart-mirror-desktop/models/settings';

interface SettingsIndexArgs {
  settings: Settings;
  // eslint-disable-next-line no-unused-vars
  onUpdate: (settings: Settings) => void;
  onSave: () => void;
}

export default class SettingsIndex extends Component<SettingsIndexArgs> {
  @tracked showSettingsButton = false;
  @tracked showSettingsModal = false;
  @tracked selectedTab = 'Layout';

  prevSettings: Settings | undefined;
  tabOptions = [
    { label: 'Layout' },
    { label: 'Stocks' },
    { label: 'News' },
    { label: 'Google' },
  ];

  @action
  updateLayout(layout: Layout) {
    this.args.onUpdate?.({
      ...this.args.settings,
      layout,
    });
  }

  @action
  updateStockWidget(stockWidget: StockWidget) {
    this.args.onUpdate?.({
      ...this.args.settings,
      stockWidget,
    });
  }

  @action
  updateNewsWidget(newsWidget: NewsWidget) {
    this.args.onUpdate?.({
      ...this.args.settings,
      newsWidget,
    });
  }

  @action
  updateGoogleWidget(googleWidget: GoogleWidget) {
    this.args.onUpdate?.({
      ...this.args.settings,
      googleWidget,
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
    this.prevSettings = { ...this.args.settings };

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
