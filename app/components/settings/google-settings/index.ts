import Component from '@glimmer/component';
import { action } from '@ember/object';
import { GoogleWidget } from 'smart-mirror-desktop/models/settings';

interface SettingsGoogleSettingsArgs {
  googleWidget: GoogleWidget;
  // eslint-disable-next-line no-unused-vars
  onUpdateGoogleWidget: (googleWidget: GoogleWidget) => void;
}

export default class SettingsStockSettingsIndex extends Component<
  SettingsGoogleSettingsArgs
> {
  @action handleGoogleWidgetVisibleChange() {
    this.args.onUpdateGoogleWidget?.({
      ...this.args.googleWidget,
      visible: !this.args.googleWidget.visible,
    });
  }
}
