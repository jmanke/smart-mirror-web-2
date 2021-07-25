import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Margin } from 'smart-mirror-desktop/models/settings';

interface SettingsProfileInputMarginIndexArgs {
  direction: 'left' | 'top' | 'right' | 'bottom';
  margin: Margin;
  // eslint-disable-next-line no-unused-vars
  onChange: (m: Margin) => void;
}

export default class SettingsProfileInputMarginIndex extends Component<SettingsProfileInputMarginIndexArgs> {
  get margin() {
    switch (this.args.direction) {
      case 'left':
        return this.args.margin.left;
      case 'top':
        return this.args.margin.top;
      case 'right':
        return this.args.margin.right;
      case 'bottom':
        return this.args.margin.bottom;
    }

    return 0;
  }

  @action
  handleValueChange(val: string) {
    let num = parseInt(val);

    if (isNaN(num) || num < 0) {
      num = 0;
    }

    this.args.onChange({ ...this.args.margin, [this.args.direction]: num });
  }
}
