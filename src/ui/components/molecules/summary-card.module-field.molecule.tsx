import { Ionicons } from '@expo/vector-icons';
import { getHours, getMinutes } from 'date-fns';
import { useThemeColor } from 'heroui-native';
import type React from 'react';
import { withUniwind } from 'uniwind';

import { useAdapters } from '@/adapter';
import { MODULE_FIELD_KEY_ENUM } from '@/domain/module/enum/module-field-key.enum';
import type { TSummaryModuleField } from '@/domain/summary/entity/summary-field.entity';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import { SummaryCard } from '@/ui/components/molecules/summary-card.molecule';
import { SummaryMiniPieChart } from '@/ui/components/molecules/summary-mini-pie-chart.molecule';
import { useNavigation } from '@/ui/hook/use-navigation.hook';

const StyledIonicons = withUniwind(Ionicons);

const formatTimeValue = (dateValue: Date) => {
  const hours = getHours(dateValue).toString().padStart(2, '0');
  const minutes = getMinutes(dateValue).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

interface SummaryModuleFieldCardProps {
  summaryModuleField: TSummaryModuleField;
  testID: string;
}

export const SummaryModuleFieldCard: React.FC<SummaryModuleFieldCardProps> = ({
  summaryModuleField,
  testID,
}) => {
  const { navigationAdapter } = useAdapters();

  const { goToSummaryFieldDetail } = useNavigation({ navigationAdapter });

  const iconColor = useThemeColor('accent');

  const handlePress = () => {
    goToSummaryFieldDetail(
      String(summaryModuleField.metadata.moduleID),
      String(summaryModuleField.metadata.moduleField.id)
    );
  };

  const resolvedTimeValue = summaryModuleField.statistics.lastRecordedAt
    ? formatTimeValue(summaryModuleField.statistics.lastRecordedAt)
    : undefined;

  const resolvedChartAverage =
    summaryModuleField.statistics.weightedAverage ??
    summaryModuleField.statistics.currentPeriodAverage ??
    null;

  return (
    <SummaryCard
      chartData={summaryModuleField.groupedData.buckets}
      title={summaryModuleField.metadata.moduleField.code}
      metricValue={summaryModuleField.statistics.currentPeriodTotal}
      timeValue={resolvedTimeValue}
      chartAverage={resolvedChartAverage}
      onPress={handlePress}
      testID={testID}
      iconElement={
        <StyledIonicons
          name={getModuleFieldIconName(
            summaryModuleField.metadata.moduleField.code
          )}
          size={18}
          style={{ color: iconColor }}
        />
      }
      chartComponent={
        <SummaryMiniPieChart
          testID={`${testID}.chart.pie`}
          data={summaryModuleField.distribution.map((d) => ({
            label: d.value,
            value: d.count,
          }))}
        />
      }
    />
  );
};

const getModuleFieldIconName = (key: MODULE_FIELD_KEY_ENUM): IconName => {
  switch (key) {
    case MODULE_FIELD_KEY_ENUM.COLOR:
      return 'accessibility';
    case MODULE_FIELD_KEY_ENUM.DISCOMFORT_LEVEL:
      return 'sad';
    case MODULE_FIELD_KEY_ENUM.TURBIDITY:
      return 'eye-off';
    case MODULE_FIELD_KEY_ENUM.VOLUMEN_LEVEL:
      return 'water';
    default:
      return 'flame';
  }
};
