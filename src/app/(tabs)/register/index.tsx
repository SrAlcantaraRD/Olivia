import { Link } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { CardAtom } from '@/ui/components/atoms/card.atom';
import {
  Typography,
  TypographyHeading,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

export default function RegisterScreen() {
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
              i18nKey="page.register.title"
              accessibilityRole="header"
            />
            <TypographySmall i18nKey="page.register.subtitle" variant="light" />
          </View>

          {/* Quick Actions */}
          <View className="gap-4">
            <TypographyHeading
              i18nKey="page.register.quick_actions"
              accessibilityRole="header"
            />

            {/* CIC Button */}
            <Link href="/(modals)/modal-register-cic" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="a11y.button.register_cic"
                accessibilityHint="a11y.hint.opens_cic_form"
              >
                <CardAtom className="flex-row items-center gap-3 p-4 bg-primary">
                  <Typography className="text-2xl">💧</Typography>
                  <Typography
                    i18nKey="component.register_cic_button.label"
                    className="text-lg font-semibold text-primary-foreground flex-1"
                  />
                </CardAtom>
              </Pressable>
            </Link>

            {/* Stool Button */}
            <Link href="/(modals)/modal-filter-history" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="a11y.button.register_stool"
                accessibilityHint="a11y.hint.opens_stool_form"
              >
                <CardAtom className="flex-row items-center gap-3 p-4 bg-secondary">
                  <Typography className="text-2xl">💩</Typography>
                  <Typography
                    i18nKey="component.register_stool_button.label"
                    className="text-lg font-semibold text-secondary-foreground flex-1"
                  />
                </CardAtom>
              </Pressable>
            </Link>

            {/* Medication Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="a11y.button.register_medication"
              accessibilityHint="a11y.hint.opens_medication_form"
            >
              <CardAtom className="flex-row items-center gap-3 p-4 bg-success">
                <Typography className="text-2xl">💊</Typography>
                <Typography
                  i18nKey="component.register_medication_button.label"
                  className="text-lg font-semibold text-success-foreground flex-1"
                />
              </CardAtom>
            </Pressable>
          </View>

          {/* Recent Activity Placeholder */}
          <View className="gap-4 mt-4">
            <TypographyHeading
              i18nKey="page.register.recent_activity"
              accessibilityRole="header"
            />
            <CardAtom className="p-4 bg-default-100">
              <TypographySmall
                i18nKey="page.register.no_recent_activity"
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
