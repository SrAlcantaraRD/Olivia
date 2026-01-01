import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export const MODULE_KEY_I18NKEYS: Record<MODULE_KEY_ENUM, Ti18nKeys> = {
  [MODULE_KEY_ENUM.CIC]: 'parent-setup.modules.catheterization.title',
  [MODULE_KEY_ENUM.STOOL]: 'parent-setup.modules.bowel-movements.title',
  [MODULE_KEY_ENUM.ENEMA]: 'parent-setup.modules.enemas.title',
  [MODULE_KEY_ENUM.URINE]: 'parent-setup.modules.urine.title',
  [MODULE_KEY_ENUM.MEDICATION]: 'parent-setup.modules.medication.title',
};
