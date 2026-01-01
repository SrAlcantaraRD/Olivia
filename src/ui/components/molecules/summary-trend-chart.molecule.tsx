import { format } from 'date-fns';
import type React from 'react';
import { useMemo } from 'react';

import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { CardAtom } from '@/ui/components/atoms/card.atom';
import { BarChartAtom } from '@/ui/components/atoms/chart.bar.atom';
import {
  TypographyHeading,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';

interface SummaryTrendChartProps {
  average: number;
  series: { date: string; value: number }[];
  period: SUMMARY_PERIOD_ENUM;
  testID: string;
}

export const SummaryTrendChart: React.FC<SummaryTrendChartProps> = ({
  average,
  series,
  period,
  testID,
}) => {
  const chartValues = useMemo(() => {
    return series.map((item) => {
      let label = '';

      switch (period) {
        case SUMMARY_PERIOD_ENUM.DAY: {
          // format: YYYY-MM-DD HH -> show 0, 6, 12, 18
          // But date string from DB is YYYY-MM-DD HH. parseISO might fail if no T.
          // sqlite result: "2023-10-27 14"
          // Let's assume the string format matches what we set in adapter: "%Y-%m-%d %H"
          const hour = parseInt(item.date.split(' ')[1] || '0', 10);
          if (hour % 6 === 0) {
            label = `${hour}:00`;
          }
          break;
        }
        case SUMMARY_PERIOD_ENUM.WEEK:
          // format: YYYY-MM-DD -> show Day Name (Mon, Tue)
          label = format(new Date(item.date), 'EEE');
          break;
        case SUMMARY_PERIOD_ENUM.MONTH: {
          // format: YYYY-MM-DD -> show Day Number
          // Sparse labels? User said "last 30 days".
          // Maybe show every 5th day?
          const day = new Date(item.date).getDate();
          if (day % 5 === 0 || day === 1) {
            label = String(day);
          }
          break;
        }
        case SUMMARY_PERIOD_ENUM.HALF_YEAR: {
          // format: YYYY-WW.
          // Label: W1, W2...
          const weekPart = item.date.split('-')[1];
          label = `W${weekPart}`;
          break;
        }
        case SUMMARY_PERIOD_ENUM.YEAR: {
          // format: YYYY-MM -> show Month Initial J, F, M...
          const month = parseInt(item.date.split('-')[1], 10) - 1;
          label = format(new Date(2000, month, 1), 'MMMMM'); // Narrow month (J, F...)
          break;
        }
      }

      return {
        count: item.value,
        value: label,
      };
    });
  }, [series, period]);

  const hasSeries = series.length > 0;

  return (
    <CardAtom testID={testID} className="rounded-lg overflow-hidden">
      <TypographySmall
        testID={`${testID}.average-label`}
        i18nKey="page.summary-detail.average-label"
        variant="light"
      />
      <TypographyHeading
        testID={`${testID}.average-value`}
        i18nKey="common.raw-value"
        values={{ value: Math.round(average) }}
      />
      <TypographySmall
        testID={`${testID}.range`}
        i18nKey="page.summary-detail.range-placeholder"
        variant="light"
        className="mb-4"
      />

      {hasSeries ? (
        <BarChartAtom
          values={chartValues}
          height={180}
          showAxisLabels={true}
          testID={`${testID}.chart`}
        />
      ) : (
        <TypographySmall
          testID={`${testID}.empty`}
          i18nKey="page.summary-detail.empty"
          variant="light"
        />
      )}
    </CardAtom>
  );
};
