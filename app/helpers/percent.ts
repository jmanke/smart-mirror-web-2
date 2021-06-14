import { helper } from '@ember/component/helper';

export function percent([percent]: string[]) {
  return `${percent}%`;
}

export default helper(percent);
