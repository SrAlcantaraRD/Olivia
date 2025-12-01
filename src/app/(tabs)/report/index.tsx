import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import { IconAtom } from '@/ui/components/atoms/icon.atom';
import {
  TypographyHeading,
  TypographyParagraph,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function ReportScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <TypographyTitle
              i18nKey="page.report.title"
              accessibilityRole="header"
            />
            <TypographySmall i18nKey="page.report.subtitle" variant="light" />
          </View>

          {/* Filter Section */}
          <View className="gap-4">
            <TypographyHeading
              i18nKey="page.report.filters"
              accessibilityRole="header"
            />

            <Link href="/(modals)/modal-filter-history" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="a11y.button.open_filters"
                accessibilityHint="a11y.hint.opens_filter_modal"
              >
                <CardAtom className="flex-row items-center gap-3 p-4 bg-default-100">
                  <IconAtom name="filter" />
                  <TypographyParagraph
                    i18nKey="component.filter_button.label"
                    className="font-medium flex-1"
                  />
                  <TypographySmall
                    i18nKey="component.filter_button.all_types"
                    variant="light"
                  />
                </CardAtom>
              </Pressable>
            </Link>
          </View>

          {/* Statistics Cards */}
          <View className="gap-4">
            <TypographyHeading
              i18nKey="page.report.statistics"
              accessibilityRole="header"
            />

            {/* Stat Card 1 - CIC */}
            <CardAtom className="p-4 bg-primary/10 border border-primary/20">
              <View className="flex-row items-center gap-2 mb-2">
                <IconAtom name="water" />
                <TypographySmall
                  i18nKey="component.stat_card.cic_label"
                  className="font-medium text-primary"
                />
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <TypographySmall
                i18nKey="component.stat_card.today"
                variant="light"
                className="mt-1"
              />
            </CardAtom>

            {/* Stat Card 2 - Stool */}
            <CardAtom className="p-4 bg-secondary/10 border border-secondary/20">
              <View className="flex-row items-center gap-2 mb-2">
                <IconAtom name="nutrition" />
                <TypographySmall
                  i18nKey="component.stat_card.stool_label"
                  className="font-medium text-secondary"
                />
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <TypographySmall
                i18nKey="component.stat_card.today"
                variant="light"
                className="mt-1"
              />
            </CardAtom>

            {/* Stat Card 3 - Medication */}
            <CardAtom className="p-4 bg-success/10 border border-success/20">
              <View className="flex-row items-center gap-2 mb-2">
                <IconAtom name="medical" />
                <TypographySmall
                  i18nKey="component.stat_card.medication_label"
                  className="font-medium text-success"
                />
              </View>
              <Text className="text-3xl font-bold text-foreground">0</Text>
              <TypographySmall
                i18nKey="component.stat_card.today"
                variant="light"
                className="mt-1"
              />
            </CardAtom>
          </View>

          {/* History Section */}
          <View className="gap-4 mt-4">
            <TypographyHeading
              i18nKey="page.report.history"
              accessibilityRole="header"
            />

            <CardAtom className="p-4 bg-default-100">
              <TypographySmall
                i18nKey="page.report.no_history"
                variant="light"
                className="text-center"
              />
            </CardAtom>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
