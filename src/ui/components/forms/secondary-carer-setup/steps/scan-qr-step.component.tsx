import {
  type BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import type { TQRBundle } from '@/domain/core/dto/qr.dto';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';

interface ScanQRStepProps {
  onReadQR: (qrBundle: TQRBundle) => void;
  testID: string;
}

export function ScanQRStep({ testID, onReadQR }: ScanQRStepProps) {
  const [hasPermission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScanned = useCallback((result: BarcodeScanningResult) => {
    if (result.data) {
      onReadQR(result.data);
    }
  }, []);

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <SpinnerAtom testID={`${testID}.loading`} />
      </View>
    );
  }

  if (hasPermission.granted === false) {
    return (
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <TypographyTitle
          i18nKey="page.caregiver-setup.scan-qr.permission.title"
          testID={`${testID}.permission.title`}
        />
        <TypographyParagraph
          i18nKey="page.caregiver-setup.scan-qr.permission.description"
          testID={`${testID}.permission.description`}
        />
        <ButtonAtom
          title="page.caregiver-setup.scan-qr.permission.request"
          onPress={requestPermission}
          testID={`${testID}.permission.request`}
        />
      </View>
    );
  }
  return (
    <View className="flex-1 justify-center bg-accent">
      <CameraView
        className="flex-1"
        style={{ flex: 1 }}
        onBarcodeScanned={handleScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        testID={`${testID}.camera`}
      />
    </View>
  );
}
