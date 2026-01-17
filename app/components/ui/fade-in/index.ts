import Component from '@glimmer/component';

interface UiFadeInIndexArgs {
  delay?: number;
}

export default class UiFadeInIndex extends Component<UiFadeInIndexArgs> {
  get delay() {
    const delay = escape(this.args.delay ? this.args.delay.toString() : '0');
    const style = `animation-delay: ${delay}ms`;

    return style;
  }
}
