import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, View } from 'react-native';

import type { CicRegisterFormData } from '../types';

interface SummaryStepProps {
  formData: CicRegisterFormData;
  onAdditionalNotesChange: (notes: string) => void;
}

export function SummaryStep({
  formData,
  onAdditionalNotesChange,
}: SummaryStepProps) {
  const { t } = useTranslation();

  const summaryItems = [
    {
      labelKey: 'page.cic_register.summary.volume_label',
      value: formData.volume
        ? t(`page.cic_register.volume.${formData.volume}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.color_label',
      value: formData.color
        ? t(`page.cic_register.color.${formData.color}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.turbidity_label',
      value: formData.turbidity
        ? t(`page.cic_register.turbidity.${formData.turbidity}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.discomfort_label',
      value: formData.discomfort
        ? t(`page.cic_register.discomfort.${formData.discomfort}` as const)
        : '-',
    },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      <View className="gap-6">
        {/* Header */}
        <View className="gap-2">
          <Text
            className="text-2xl font-semibold text-foreground"
            accessibilityRole="header"
          >
            {t('page.cic_register.summary.title')}
          </Text>
          <Text className="text-base text-default-500">
            {t('page.cic_register.summary.description')}
          </Text>
        </View>

        {/* Summary Cards */}
        <View className="gap-3">
          {summaryItems.map((item) => (
            <View
              key={item.labelKey}
              className="p-4 bg-default-100 rounded-xl border border-default-200"
            >
              <Text className="text-sm font-medium text-default-500 mb-1">
                {t(item.labelKey)}
              </Text>
              <Text className="text-lg font-semibold text-foreground">
                {item.value}
              </Text>
            </View>
          ))}

          {/* Show discomfort note if pain was reported */}
          {formData.discomfort === 'pain' && formData.discomfortNote && (
            <View className="p-4 bg-warning/10 rounded-xl border border-warning/20">
              <Text className="text-sm font-medium text-warning mb-1">
                {t('page.cic_register.discomfort.note_label')}
              </Text>
              <Text className="text-base text-foreground">
                {formData.discomfortNote}
              </Text>
            </View>
          )}
        </View>

        {/* Additional Notes */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            {t('page.cic_register.summary.notes_label')}
          </Text>
          <TextInput
            value={formData.additionalNotes}
            onChangeText={onAdditionalNotesChange}
            placeholder={t('page.cic_register.summary.notes_placeholder')}
            placeholderTextColor="rgb(163 163 163)"
            multiline
            numberOfLines={4}
            className="p-4 bg-default-100 rounded-xl border-2 border-default-200 text-foreground"
            accessibilityLabel={t('page.cic_register.summary.notes_label')}
            accessibilityHint="Añade cualquier información adicional que consideres relevante"
          />
        </View>
      </View>
    </ScrollView>
  );
}
