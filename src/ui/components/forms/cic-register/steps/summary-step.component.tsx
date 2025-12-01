import { useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, TextInput, View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographySubtitle,
} from '@/ui/components/atoms/typography.atom';
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
  const foregroundColor = useThemeColor('foreground');

  const summaryItems = [
    {
      labelKey: 'page.cic_register.summary.volume_label' as const,
      value: formData.volume
        ? t(`page.cic_register.volume.${formData.volume}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.color_label' as const,
      value: formData.color
        ? t(`page.cic_register.color.${formData.color}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.turbidity_label' as const,
      value: formData.turbidity
        ? t(`page.cic_register.turbidity.${formData.turbidity}` as const)
        : '-',
    },
    {
      labelKey: 'page.cic_register.summary.discomfort_label' as const,
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
          <TypographySubtitle
            i18nKey="page.cic_register.summary.title"
            accessibilityRole="header"
          />
          <TypographySmall
            i18nKey="page.cic_register.summary.description"
            variant="light"
          />
        </View>

        {/* Summary Cards */}
        <View className="gap-3">
          {summaryItems.map((item) => (
            <CardAtom
              key={item.labelKey}
              className="p-4 bg-default-100 border border-default-200"
            >
              <TypographySmall
                i18nKey={item.labelKey}
                className="font-medium mb-1"
                variant="light"
              />
              <TypographyHeading
                style={{ color: foregroundColor }}
                size="lg"
                weight="semibold"
              >
                {item.value}
              </TypographyHeading>
            </CardAtom>
          ))}

          {/* Show discomfort note if pain was reported */}
          {formData.discomfort === 'pain' && formData.discomfortNote && (
            <CardAtom className="p-4 bg-warning/10 border border-warning/20">
              <TypographySmall
                i18nKey="page.cic_register.discomfort.note_label"
                className="font-medium text-warning mb-1"
              />
              <TypographyParagraph style={{ color: foregroundColor }}>
                {formData.discomfortNote}
              </TypographyParagraph>
            </CardAtom>
          )}
        </View>

        {/* Additional Notes */}
        <View className="gap-2">
          <TypographySmall
            i18nKey="page.cic_register.summary.notes_label"
            className="font-medium"
          />
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
