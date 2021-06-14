//@ts-ignore
import { v4 as uuidv4 } from 'uuid';

// `PropertyKey` is short for "string | number | symbol"
// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
export function hasKey<O>(
  obj: O,
  key: string | number | symbol
): key is keyof O {
  return key in obj;
}

export function formatTemp(temp: number | string) {
  return temp.toString() + '\u00b0';
}

export function title(str?: string) {
  if (!str) {
    return '';
  }

  const lowerStr = str.toLowerCase();
  let title = '';
  const words = lowerStr.split(' ');

  for (const word of words) {
    title += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
  }

  return title.trimEnd();
}

export function isSameArray(arr1: any[], arr2: any[], key: string) {
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i][key] !== arr2[i][key]) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export function uniqueId(baseId?: string) {
  return `${baseId ?? ''}-${uuidv4()}`;
}

export function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
