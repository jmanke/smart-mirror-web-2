import { DateTime } from 'luxon';

export function getFormattedDate(date: Date) {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function amPmFormattedTime(date: Date) {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

export function isWeekend(dateTime: DateTime) {
  return dateTime.weekday === 6 || dateTime.weekday === 7;
}
