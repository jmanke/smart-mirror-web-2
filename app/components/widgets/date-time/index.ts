import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  amPmFormattedTime,
  getFormattedDate,
} from 'smart-mirror-desktop/utils/dateUtils';

interface WidgetsDateTimeArgs {}

export default class WidgetsDateTime extends Component<WidgetsDateTimeArgs> {
  @tracked
  time: string = '';

  @tracked
  date: string = '';

  updateTime;

  constructor(owner: any, args: WidgetsDateTimeArgs) {
    super(owner, args);

    this.updateTime = setInterval(() => {
      const now = new Date();
      this.time = amPmFormattedTime(now);
      this.date = getFormattedDate(now);
    }, 1000);
  }

  willDestroy() {
    super.willDestroy();

    window.clearInterval(this.updateTime);
  }
}
