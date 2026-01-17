import { action } from '@ember/object';
import Component from '@glimmer/component';
import { Layout, Margin } from 'smart-mirror-desktop/models/settings';

interface SettingsLayoutSettingsIndexArgs {
  layout: Layout;
  // eslint-disable-next-line no-unused-vars
  onLayoutChange: (layout: Layout) => void;
}

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 96;

export default class SettingsLayoutSettingsIndex extends Component<SettingsLayoutSettingsIndexArgs> {
  get fontSize() {
    return this.args.layout.fontSize.substring(
      0,
      this.args.layout.fontSize.length - 2
    );
  }

  @action
  handleMarginChange(margin: Margin) {
    this.args.onLayoutChange?.({
      ...this.args.layout,
      margin,
    });
  }

  @action
  handleFontSizeChange(e: Event) {
    let size = parseInt((e.target as HTMLInputElement).value);

    if (size < MIN_FONT_SIZE) {
      size = MIN_FONT_SIZE;
    } else if (size > MAX_FONT_SIZE) {
      size = MAX_FONT_SIZE;
    }

    this.args.onLayoutChange?.({
      ...this.args.layout,
      fontSize: `${size}px`,
    });
  }
}
