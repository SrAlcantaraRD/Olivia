import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import type { IconName } from '@/ui/components/atoms/icon.atom';

/**
 * UI Constants for Time-to-Live options
 * Maps TTL values to appropriate icons for better UX
 */
export const TTL_ICONS: Record<TIME_TO_LIVE, IconName> = {
  [TIME_TO_LIVE.ONE_DAY]: 'sunny',
  [TIME_TO_LIVE.ONE_WEEK]: 'calendar',
  [TIME_TO_LIVE.ONE_MONTH]: 'moon',
};
