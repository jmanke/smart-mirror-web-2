import { helper } from '@ember/component/helper';

export function mph([speed]: string[]) {
  return `${speed} mph`;
}

export default helper(mph);
