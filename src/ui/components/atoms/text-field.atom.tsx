import { Ionicons } from '@expo/vector-icons';
import { TextField, useThemeColor } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { Pressable, type TextInputProps } from 'react-native';
import { withUniwind } from 'uniwind';

import type { IconName } from '@/ui/components/atoms/icon.atom';
import { TextTranslation } from '@/ui/components/atoms/text-translations.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface TextFieldAtomProps extends Omit<TextInputProps, 'placeholder'> {
  label?: Ti18nKeys;
  placeholder?: Ti18nKeys;
  description?: Ti18nKeys;
  errorMessage?: Ti18nKeys;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  startIcon?: IconName;
  onPressStartIcon?: () => void;
  endIcon?: IconName;
  onPressEndIcon?: () => void;
}

const StyledIonicons = withUniwind(Ionicons);

export const TextFieldAtom = ({
  label,
  placeholder,
  description,
  errorMessage,
  isRequired = false,
  isInvalid = false,
  isDisabled = false,
  startIcon,
  endIcon,
  onPressStartIcon,
  onPressEndIcon,
  ...inputProps
}: TextFieldAtomProps) => {
  const { t } = useTranslation();

  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const inputBgColor = useThemeColor('background-secondary');

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      {label && (
        <TextField.Label>
          <TextTranslation i18nKey={label} />
        </TextField.Label>
      )}
      <TextField.Input
        placeholder={placeholder ? t(placeholder) : undefined}
        placeholderTextColor={mutedColor}
        style={{
          backgroundColor: inputBgColor,
          color: foregroundColor,
        }}
        {...inputProps}
      >
        {startIcon && (
          <TextField.InputStartContent>
            <Pressable onPress={onPressStartIcon}>
              <StyledIonicons
                name={startIcon}
                size={16}
                className="text-muted"
              />
            </Pressable>
          </TextField.InputStartContent>
        )}
        {endIcon && (
          <TextField.InputEndContent>
            <Pressable onPress={onPressEndIcon}>
              <StyledIonicons name={endIcon} size={16} className="text-muted" />
            </Pressable>
          </TextField.InputEndContent>
        )}
        {startIcon && endIcon && (
          <TextField.InputEndContent>
            <Pressable onPress={onPressEndIcon}>
              <StyledIonicons name={endIcon} size={16} className="text-muted" />
            </Pressable>
          </TextField.InputEndContent>
        )}
      </TextField.Input>
      {description && !isInvalid && (
        <TextField.Description>
          <TextTranslation i18nKey={description} />
        </TextField.Description>
      )}
      {errorMessage && isInvalid && (
        <TextField.ErrorMessage>
          <TextTranslation i18nKey={errorMessage} />
        </TextField.ErrorMessage>
      )}
    </TextField>
  );
};
