import z from 'zod';

import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export enum TIME_TO_LIVE {
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1m',
}

export const TTL_LABELS: Record<TIME_TO_LIVE, Ti18nKeys> = {
  [TIME_TO_LIVE.ONE_DAY]: 'time-to-live.one-day',
  [TIME_TO_LIVE.ONE_WEEK]: 'time-to-live.one-week',
  [TIME_TO_LIVE.ONE_MONTH]: 'time-to-live.one-month',
};

export const TimeToLiveSchema = z.enum(TIME_TO_LIVE);

export const getTimeToLiveOptions = (): {
  label: Ti18nKeys;
  value: TIME_TO_LIVE;
}[] => {
  return Object.keys(TIME_TO_LIVE).map((key) => {
    const value = TIME_TO_LIVE[key as keyof typeof TIME_TO_LIVE];
    return {
      label: TTL_LABELS[value],
      value,
    };
  });
};
