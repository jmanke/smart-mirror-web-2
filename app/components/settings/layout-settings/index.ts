import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Margin, Layout } from 'smart-mirror-desktop/models/settings';

interface SettingsLayoutSettingsIndexArgs {
  layout: Layout;
  // eslint-disable-next-line no-unused-vars
  onLayoutChange: (layout: Layout) => void;
}

export default class SettingsLayoutSettingsIndex extends Component<SettingsLayoutSettingsIndexArgs> {
  @action
  handleMarginChange(margin: Margin) {
    this.args.onLayoutChange?.({
      ...this.args.layout,
      margin,
    });
  }
}
