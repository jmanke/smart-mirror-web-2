import Component from '@glimmer/component';

interface UiFadeInListItemIndexArgs {
  delay?: number;
  fadeOutLastItems?: boolean;
  currIndex: number;
  listLength: number;
}

export default class UiFadeInListItemIndex extends Component<UiFadeInListItemIndexArgs> {
  get delay() {
    return this.args.currIndex * (this.args.delay ?? 0);
  }

  get fadeInAnimOverride() {
    if (this.args.fadeOutLastItems && this.args.listLength > 3) {
      if (this.args.currIndex === this.args.listLength - 2) {
        return 'animate-fade-in-down-50';
      } else if (this.args.currIndex === this.args.listLength - 1) {
        return 'animate-fade-in-down-25';
      }
    }

    return '';
  }
}
