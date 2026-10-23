import { Ionicons } from '@expo/vector-icons';
import {
  Description,
  FieldError,
  Input,
  Label,
  TextField,
  useThemeColor,
} from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { Pressable, type TextInputProps, View } from 'react-native';
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
  onPress,
  ...inputProps
}: TextFieldAtomProps) => {
  const { t } = useTranslation();

  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const inputBgColor = useThemeColor('background-secondary');

  const renderInput = () => (
    <Input
      placeholder={placeholder ? t(placeholder) : undefined}
      placeholderTextColor={mutedColor}
      style={{
        backgroundColor: inputBgColor,
        color: foregroundColor,
        paddingLeft: startIcon ? 36 : undefined,
        paddingRight: endIcon ? 36 : undefined,
      }}
      {...inputProps}
    />
  );

  return (
    <TextField
      isRequired={isRequired}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      {label && (
        <Label>
          <TextTranslation i18nKey={label} />
        </Label>
      )}
      <View className="relative w-full">
        {onPress ? (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            className="w-full"
          >
            <View pointerEvents="none">{renderInput()}</View>
          </Pressable>
        ) : (
          renderInput()
        )}
        {startIcon && (
          <Pressable
            onPress={onPressStartIcon}
            className="absolute left-3 top-0 bottom-0 justify-center"
          >
            <StyledIonicons name={startIcon} size={16} className="text-muted" />
          </Pressable>
        )}
        {endIcon && (
          <Pressable
            onPress={onPressEndIcon}
            className="absolute right-3 top-0 bottom-0 justify-center"
          >
            <StyledIonicons name={endIcon} size={16} className="text-muted" />
          </Pressable>
        )}
      </View>
      {description && !isInvalid && (
        <Description>
          <TextTranslation i18nKey={description} />
        </Description>
      )}
      {errorMessage && isInvalid && (
        <FieldError>
          <TextTranslation i18nKey={errorMessage} />
        </FieldError>
      )}
    </TextField>
  );
};
