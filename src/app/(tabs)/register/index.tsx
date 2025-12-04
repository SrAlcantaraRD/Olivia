import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useAdapters } from '@/adapter';
import { useNavigation } from '@/hooks/use-navigation.hook';
import {
  TypographyHeading,
  TypographySmall,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';

export default function RegisterScreen() {
  const { navigationAdapter } = useAdapters();
  const { goToRegisterCic, goToFilterHistory } = useNavigation({
    navigationAdapter,
  });
  const [selectedAction, setSelectedAction] = useState<
    'cic' | 'stool' | 'medication' | null
  >(null);

  const handleCicSelect = () => {
    setSelectedAction('cic');
    goToRegisterCic();
  };

  const handleStoolSelect = () => {
    setSelectedAction('stool');
    goToFilterHistory();
  };

  const handleMedicationSelect = () => {
    setSelectedAction('medication');
    // TODO: Navigate to medication registration when implemented
  };

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
            <CardWithDetails
              icon="water"
              titleKey="component.register_cic_button.label"
              subtitleKey="component.register_cic_button.subtitle"
              descriptionKey="component.register_cic_button.description"
              isSelected={selectedAction === 'cic'}
              onSelect={handleCicSelect}
              testID="register.cic"
            />

            {/* Stool Button */}
            <CardWithDetails
              icon="nutrition"
              titleKey="component.register_stool_button.label"
              subtitleKey="component.register_stool_button.subtitle"
              descriptionKey="component.register_stool_button.description"
              testID="register.stool"
              isSelected={selectedAction === 'stool'}
              onSelect={handleStoolSelect}
            />

            {/* Medication Button */}
            <CardWithDetails
              icon="medical"
              titleKey="component.register_medication_button.label"
              subtitleKey="component.register_medication_button.subtitle"
              descriptionKey="component.register_medication_button.description"
              isSelected={selectedAction === 'medication'}
              testID="register.medication"
              onSelect={handleMedicationSelect}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
