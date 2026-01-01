import { MODULE_FIELD_KEY_ENUM } from '@/domain/module/enum/module-field-key.enum';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export const MODULE_FIELD_KEY_ENUM_I18NKEYS: Record<
  MODULE_FIELD_KEY_ENUM,
  Ti18nKeys
> = {
  [MODULE_FIELD_KEY_ENUM.COLOR]: 'enum.module-field-key.color',
  [MODULE_FIELD_KEY_ENUM.DISCOMFORT_LEVEL]:
    'enum.module-field-key.discomfort-level',
  [MODULE_FIELD_KEY_ENUM.TURBIDITY]: 'enum.module-field-key.turbidity',
  [MODULE_FIELD_KEY_ENUM.VOLUMEN_LEVEL]: 'enum.module-field-key.volumen-level',
};
