import { helper } from '@ember/component/helper';
import { amPmFormattedTime } from 'smart-mirror-desktop/utils/dateUtils';

export function amPmTime(params: string[]) {
  return amPmFormattedTime(new Date(params[0]));
}

export default helper(amPmTime);
