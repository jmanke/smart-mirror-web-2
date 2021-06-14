import { helper } from '@ember/component/helper';

export function title([title]: string[]) {
  if (!title) {
    return '';
  }

  const lowerStr = title.toLowerCase();
  let t = '';
  const words = lowerStr.split(' ');

  for (const word of words) {
    t += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
  }

  return t.trimEnd();
}

export default helper(title);
