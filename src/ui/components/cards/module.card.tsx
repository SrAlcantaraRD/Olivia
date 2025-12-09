import { useCallback } from 'react';

import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import { CardWithDetails } from '@/ui/components/molecules/card-with-details.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface CardWithDetailsProps {
  module: TModule;
  isSelected: boolean;
  onSelect: () => void;
  testID: string;
}

export function ModuleCard({
  module,
  isSelected,
  onSelect,
  testID,
}: CardWithDetailsProps) {
  const getIconFromModuleCode = useCallback(
    (code: MODULE_KEY_ENUM): IconName => {
      const mapIcon: Record<MODULE_KEY_ENUM, IconName> = {
        [MODULE_KEY_ENUM.CIC]: 'water',
        [MODULE_KEY_ENUM.STOOL]: 'document-text',
        [MODULE_KEY_ENUM.ENEMA]: 'medical',
        [MODULE_KEY_ENUM.URINE]: 'water',
        [MODULE_KEY_ENUM.MEDICATION]: 'medical',
      };

      return mapIcon[code] ?? 'image';
    },
    []
  );

  const getTitleFromModuleCode = useCallback(
    (code: MODULE_KEY_ENUM): Ti18nKeys => {
      const mapTitle: Record<MODULE_KEY_ENUM, Ti18nKeys> = {
        [MODULE_KEY_ENUM.CIC]: 'parent-setup.modules.catheterization.title',
        [MODULE_KEY_ENUM.STOOL]: 'parent-setup.modules.bowel-movements.title',
        [MODULE_KEY_ENUM.ENEMA]: 'parent-setup.modules.enemas.title',
        [MODULE_KEY_ENUM.URINE]: 'parent-setup.modules.urine.title',
        [MODULE_KEY_ENUM.MEDICATION]: 'parent-setup.modules.medication.title',
      };

      return mapTitle[code] ?? 'parent-setup.modules.unknown.title';
    },
    []
  );

  const getDescriptionFromModuleCode = useCallback(
    (code: MODULE_KEY_ENUM): Ti18nKeys => {
      const mapDescription: Record<MODULE_KEY_ENUM, Ti18nKeys> = {
        [MODULE_KEY_ENUM.CIC]:
          'parent-setup.modules.catheterization.description',
        [MODULE_KEY_ENUM.STOOL]:
          'parent-setup.modules.bowel-movements.description',
        [MODULE_KEY_ENUM.ENEMA]: 'parent-setup.modules.enemas.description',
        [MODULE_KEY_ENUM.URINE]: 'parent-setup.modules.urine.description',
        [MODULE_KEY_ENUM.MEDICATION]:
          'parent-setup.modules.medication.description',
      };

      return mapDescription[code] ?? 'parent-setup.modules.unknown.description';
    },
    []
  );

  return (
    <CardWithDetails
      key={module.id}
      icon={getIconFromModuleCode(module.code)}
      titleKey={getTitleFromModuleCode(module.code)}
      descriptionKey={getDescriptionFromModuleCode(module.code)}
      isSelected={isSelected}
      onSelect={onSelect}
      testID={`${testID}.module-card.${module.code}`}
    />
  );
}
