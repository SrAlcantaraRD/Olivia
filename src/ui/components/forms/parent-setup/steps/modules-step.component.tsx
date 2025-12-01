import { View } from 'react-native';

import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import { MODULE_IDS } from '../types';

interface ModulesStepProps {
  selectedModules: Set<string>;
  onToggleModule: (moduleId: string) => void;
}

export function ModulesStep({
  selectedModules,
  onToggleModule,
}: ModulesStepProps) {
  return (
    <View className="mb-6">
      <CardWithDetails
        icon="water"
        titleKey="parent-setup.modules.catheterization.title"
        descriptionKey="parent-setup.modules.catheterization.description"
        isSelected={selectedModules.has(MODULE_IDS.CATHETERIZATION)}
        onSelect={() => onToggleModule(MODULE_IDS.CATHETERIZATION)}
      />

      <CardWithDetails
        icon="document-text"
        titleKey="parent-setup.modules.bowel-movements.title"
        descriptionKey="parent-setup.modules.bowel-movements.description"
        isSelected={selectedModules.has(MODULE_IDS.BOWEL_MOVEMENTS)}
        onSelect={() => onToggleModule(MODULE_IDS.BOWEL_MOVEMENTS)}
      />

      <CardWithDetails
        icon="medical"
        titleKey="parent-setup.modules.enemas.title"
        descriptionKey="parent-setup.modules.enemas.description"
        isSelected={selectedModules.has(MODULE_IDS.ENEMAS)}
        onSelect={() => onToggleModule(MODULE_IDS.ENEMAS)}
      />
    </View>
  );
}
