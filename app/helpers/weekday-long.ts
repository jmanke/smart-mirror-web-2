import { helper } from '@ember/component/helper';

export function weekdayLong([date]: Date[]) {
  return date.toLocaleString('en-US', {
    weekday: 'long',
  });
}

export default helper(weekdayLong);
