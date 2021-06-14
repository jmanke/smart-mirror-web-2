import { helper } from '@ember/component/helper';

export function currency([currency]: number[]) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(currency);
}

export default helper(currency);
