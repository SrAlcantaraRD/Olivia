import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { BaseToastProps as RNToastBaseProps } from 'react-native-toast-message';
import { withUniwind } from 'uniwind';

import type { IconName } from '@/ui/components/atoms/icon.atom';
import {
  TypographyParagraph,
  TypographySmall,
} from '@/ui/components/atoms/typography.atom';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

const StyledIonicons = withUniwind(Ionicons);

// Fixed colors for dark theme design
// TODO: use useThemeColor
const TOAST_BG_COLOR = '#2C3E50'; // Dark grey background
const TITLE_TEXT_COLOR = 'white';
const DETAIL_TEXT_COLOR = '#BBBBBB'; // Light grey

interface CustomToastProps extends RNToastBaseProps {
  text1?: Ti18nKeys;
  text2?: Ti18nKeys;
}

interface BaseToastProps {
  iconName: IconName;
  iconBgColor: string;
  auraColor: string;
}
interface BaseToastProps {
  text1?: Ti18nKeys;
  text2?: Ti18nKeys;
  iconName: IconName;
  iconBgColor: string;
  auraColor: string;
}

// Aura SVG component for radial gradient spotlight effect
const AuraSVG = ({ color }: { color: string }) => {
  return (
    <View
      style={[StyleSheet.absoluteFillObject]}
      className="rounded-xl overflow-hidden"
    >
      <Svg width="100%" height="200%">
        <Defs>
          <RadialGradient id="auraGrad" cx="-90%" cy="50%" r="200%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.05" />
            <Stop offset="25%" stopColor={color} stopOpacity="0.5" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#auraGrad)" />
      </Svg>
    </View>
  );
};

// Base reusable toast component
const BaseToast = ({
  text1,
  text2,
  iconName,
  iconBgColor,
  auraColor,
}: BaseToastProps) => {
  return (
    // <View
    //   style={{
    //     bottom: 20,
    //     left: '5%',
    //     right: '5%',
    //     minHeight: 60,
    //     backgroundColor: TOAST_BG_COLOR,
    //     borderRadius: 12,
    //   }}
    //   className="absolute flex-row items-center shadow-lg overflow-hidden"
    // >
    <View className="absolute bottom-5 left-[5%] right-[5%] min-h-[60px] bg-[#2C3E50] rounded-xl flex-row items-center shadow-lg overflow-hidden p-4">
      {/* Aura background SVG radial gradient */}
      <AuraSVG color={auraColor} />

      <View className="flex-row items-center flex-1">
        {/* Icon circle with solid color */}
        <View
          style={{ backgroundColor: iconBgColor }}
          className="w-8 h-8 rounded-full items-center justify-center mr-3 z-10"
        >
          <StyledIonicons
            name={iconName}
            size={24}
            style={{ color: TOAST_BG_COLOR }}
          />
        </View>

        {/* Text content */}
        <View className="flex-1 z-10">
          {text1 && (
            <TypographyParagraph
              i18nKey={text1}
              size="lg"
              weight="semibold"
              style={{
                color: TITLE_TEXT_COLOR,
                marginBottom: text2 ? 4 : 0,
              }}
              testID={`screen.toast.${text1}.title`}
            />
          )}
          {text2 && (
            <TypographySmall
              i18nKey={text2}
              size="sm"
              style={{
                color: DETAIL_TEXT_COLOR,
              }}
              testID={`screen.toast.${text2}.detail`}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const SuccessToast = ({ text1, text2 }: CustomToastProps) => {
  const successColor = '#44D07F';

  return (
    <BaseToast
      text1={text1}
      text2={text2}
      iconName="checkmark-sharp"
      iconBgColor={successColor}
      auraColor={successColor}
    />
  );
};

const ErrorToast = ({ text1, text2 }: CustomToastProps) => {
  const errorColor = '#D92D20';

  return (
    <BaseToast
      text1={text1}
      text2={text2}
      iconName="close"
      iconBgColor={errorColor}
      auraColor={errorColor}
    />
  );
};

const WarningToast = ({ text1, text2 }: CustomToastProps) => {
  const warningColor = '#F59E0B';

  return (
    <BaseToast
      text1={text1}
      text2={text2}
      iconName="warning"
      iconBgColor={warningColor}
      auraColor={warningColor}
    />
  );
};

const InfoToast = ({ text1, text2 }: CustomToastProps) => {
  const infoColor = '#3B82F6';

  return (
    <BaseToast
      text1={text1}
      text2={text2}
      iconName="information-circle"
      iconBgColor={infoColor}
      auraColor={infoColor}
    />
  );
};

export const toastConfig = {
  success: SuccessToast,
  error: ErrorToast,
  warning: WarningToast,
  info: InfoToast,
  delete: ErrorToast, // Reuse error style for delete
};
