import Component from '@glimmer/component';
import { action } from '@ember/object';
import { NewsWidget } from 'smart-mirror-desktop/models/settings';

interface SettingsNewsSettingsArgs {
  newsWidget: NewsWidget;
  // eslint-disable-next-line no-unused-vars
  onUpdateNewsWidget: (newsWidget: NewsWidget) => void;
}

export default class SettingsNewsSettingsIndex extends Component<SettingsNewsSettingsArgs> {
  @action
  updateWidth(width: string) {
    this.args.onUpdateNewsWidget({
      ...this.args.newsWidget,
      width: parseInt(width),
    });
  }
}
