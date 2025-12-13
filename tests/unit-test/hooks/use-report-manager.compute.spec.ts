import { TIME_RANGE_ENUM } from '@/domain/core/enum/time-range.enum';
import { computeTimeRange } from '@/hooks/use-report-manager.hook';

describe('computeTimeRange', () => {
  it('returns today range with start at 00:00 local', () => {
    const { startDate, endDate } = computeTimeRange(TIME_RANGE_ENUM.TODAY);
    const now = new Date();
    expect(endDate.getFullYear()).toBe(now.getFullYear());
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
  });

  it('returns 7d range approximately 7 days apart', () => {
    const { startDate, endDate } = computeTimeRange(TIME_RANGE_ENUM.WEEK_7D);
    const diffDays = Math.round(
      (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    expect([6, 7, 8]).toContain(diffDays);
  });

  it('returns 30d and 90d ranges', () => {
    const r30 = computeTimeRange(TIME_RANGE_ENUM.MONTH_30D);
    const r90 = computeTimeRange(TIME_RANGE_ENUM.QUARTER_90D);
    const diff30 = Math.round(
      (r30.endDate.getTime() - r30.startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const diff90 = Math.round(
      (r90.endDate.getTime() - r90.startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    expect(diff30).toBeGreaterThanOrEqual(29);
    expect(diff90).toBeGreaterThanOrEqual(89);
  });
});
