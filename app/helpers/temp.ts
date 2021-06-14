import { helper } from '@ember/component/helper';
import { formatTemp } from 'smart-mirror-desktop/utils/utils';

export function temp([temp]: string[]) {
  return formatTemp(temp);
}

export default helper(temp);
