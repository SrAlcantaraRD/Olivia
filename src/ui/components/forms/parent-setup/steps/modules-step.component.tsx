import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { ModuleCard } from '../components/module-card.component';
import { MODULE_IDS } from '../types';

interface ModulesStepProps {
  selectedModules: Set<string>;
  onToggleModule: (moduleId: string) => void;
}

export function ModulesStep({
  selectedModules,
  onToggleModule,
}: ModulesStepProps) {
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const accentColor = useThemeColor('accent');
  const cardBgColor = useThemeColor('surface');

  return (
    <View className="mb-6">
      <ModuleCard
        icon="water"
        titleKey="parent-setup.modules.catheterization.title"
        descriptionKey="parent-setup.modules.catheterization.description"
        isSelected={selectedModules.has(MODULE_IDS.CATHETERIZATION)}
        onToggle={() => onToggleModule(MODULE_IDS.CATHETERIZATION)}
        accentColor={accentColor}
        foregroundColor={foregroundColor}
        mutedColor={mutedColor}
        cardBgColor={cardBgColor}
      />

      <ModuleCard
        icon="document-text"
        titleKey="parent-setup.modules.bowel-movements.title"
        descriptionKey="parent-setup.modules.bowel-movements.description"
        isSelected={selectedModules.has(MODULE_IDS.BOWEL_MOVEMENTS)}
        onToggle={() => onToggleModule(MODULE_IDS.BOWEL_MOVEMENTS)}
        accentColor={accentColor}
        foregroundColor={foregroundColor}
        mutedColor={mutedColor}
        cardBgColor={cardBgColor}
      />

      <ModuleCard
        icon="medical"
        titleKey="parent-setup.modules.enemas.title"
        descriptionKey="parent-setup.modules.enemas.description"
        isSelected={selectedModules.has(MODULE_IDS.ENEMAS)}
        onToggle={() => onToggleModule(MODULE_IDS.ENEMAS)}
        accentColor={accentColor}
        foregroundColor={foregroundColor}
        mutedColor={mutedColor}
        cardBgColor={cardBgColor}
      />
    </View>
  );
}
