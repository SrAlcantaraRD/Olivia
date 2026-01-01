import { useThemeColor } from 'heroui-native';
import { useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QRCodeViewer = {
  data: string;
};

export const QRCodeViewer = ({ data }: QRCodeViewer) => {
  const { width: windowWidth } = useWindowDimensions();

  const backgroundColor = useThemeColor('accent');
  const accentColor = useThemeColor('background');

  return (
    <View className="bg-accent p-2 rounded-lg shadow-lg">
      <QRCode
        value={data}
        size={windowWidth * 0.8}
        color={accentColor}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};
