# Client implementation examples

This document provides comprehensive examples of how to implement client-side operations in the Oliva app, following Clean Architecture patterns.

## UI component integration

Components use domain hooks that wrap use-cases, never calling ports directly.

### Record creation form

```typescript
// src/ui/components/record-form.component.tsx
import { useCreateRecord } from '@/hooks/use-create-record.hook';
import { TCreateRecordRequest } from '@/domain/core/use-case-schema/create-record.use-case-schema';

export function RecordForm({ moduleId }: { moduleId: number }) {
  const createRecord = useCreateRecord();
  const [fieldValues, setFieldValues] = useState<Record<string, unknown>>({});

  const handleSubmit = async () => {
    const request: TCreateRecordRequest = {
      moduleId,
      fieldValues,
    };

    const result = await createRecord.execute(request);
    if (result.success) {
      // Navigate to success screen
      navigation.navigate('RecordSuccess', { recordId: result.data.record.id });
    }
  };

  return (
    <View>
      {/* Form fields */}
      <Button onPress={handleSubmit} title="Create Record" />
    </View>
  );
}
```

### Domain hook implementation

```typescript
// src/hooks/use-create-record.hook.ts
import { useAdapters } from '@/hooks/use-adapters.hook';
import { CreateRecordUseCase } from '@/domain/core/use-case/create-record.use-case';
import { TCreateRecordRequest, TCreateRecordResponse } from '@/domain/core/use-case-schema/create-record.use-case-schema';

export function useCreateRecord() {
  const adapters = useAdapters();

  return useMemo(() => {
    const useCase = new CreateRecordUseCase(
      adapters.recordPort,
      adapters.recordFieldPort,
      adapters.notifyPort
    );

    return {
      execute: (request: TCreateRecordRequest): Promise<TCreateRecordResponse> => {
        return useCase.execute(request);
      },
    };
  }, [adapters]);
}
```

## Adapter injection pattern

The `useAdapters()` hook provides all port implementations.

```typescript
// src/hooks/use-adapters.hook.ts
import { useContext } from 'react';
import { AdaptersContext } from '@/app/_layout'; // Root layout provides context

export function useAdapters() {
  const adapters = useContext(AdaptersContext);
  if (!adapters) {
    throw new Error('Adapters not provided');
  }
  return adapters;
}

// Root layout setup
// src/app/_layout.tsx
import { createAdapters } from '@/adapter/create-adapters';

export default function RootLayout() {
  const adapters = useMemo(() => createAdapters(), []);

  return (
    <AdaptersContext.Provider value={adapters}>
      <Stack />
    </AdaptersContext.Provider>
  );
}
```

## QR code generation and scanning

### Generating sync QR codes

```typescript
// src/hooks/use-generate-sync-qr.hook.ts
import { useAdapters } from '@/hooks/use-adapters.hook';
import { GenerateRecordSynchronizationQRUseCase } from '@/domain/core/use-case/generate-record-synchronization-qr.use-case';

export function useGenerateSyncQR() {
  const adapters = useAdapters();

  return useMemo(() => {
    const useCase = new GenerateRecordSynchronizationQRUseCase(
      adapters.recordPort,
      adapters.qrPort
    );

    return {
      execute: async (moduleId: number, dateRange: { from: Date; to: Date }) => {
        const records = await adapters.recordPort.findByModuleAndDate(
          moduleId,
          dateRange.from,
          dateRange.to
        );

        return useCase.execute({ records });
      },
    };
  }, [adapters]);
}

// Usage in component
export function SyncScreen() {
  const generateQR = useGenerateSyncQR();
  const [qrChunks, setQrChunks] = useState<string[]>([]);

  const handleGenerate = async () => {
    const result = await generateQR.execute(moduleId, dateRange);
    if (result.success) {
      setQrChunks(result.data.chunkList);
    }
  };

  return (
    <View>
      {qrChunks.map((chunk, index) => (
        <QRCode key={index} value={chunk} />
      ))}
    </View>
  );
}
```

### Scanning and processing QR data

```typescript
// src/hooks/use-scan-qr.hook.ts
import { useAdapters } from '@/hooks/use-adapters.hook';
import { ProcessQRDataUseCase } from '@/domain/core/use-case/process-qr-data.use-case';

export function useScanQR() {
  const adapters = useAdapters();

  return useMemo(() => {
    const useCase = new ProcessQRDataUseCase(
      adapters.qrPort,
      adapters.recordPort,
      adapters.notifyPort
    );

    return {
      execute: async (qrString: string) => {
        return useCase.execute({ qrData: qrString });
      },
    };
  }, [adapters]);
}

// Camera component integration
import { Camera } from 'expo-camera';

export function QRScanner() {
  const scanQR = useScanQR();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    try {
      const result = await scanQR.execute(data);
      if (result.success) {
        // Handle successful sync
        Alert.alert('Success', 'Data synchronized successfully');
      }
    } catch (error) {

- **Reusability**: Hooks can be shared across components
- **Memoization**: Prevents unnecessary re-instantiation
- **Testing**: Easy to mock adapters in hook tests

Trade-off: Additional abstraction layer.

### State and data fetching

React Query is **not** a dependency of this project. Async work is orchestrated by
domain hooks and use-cases, with Zustand stores for shared domain state and
`ICachePort` for cached summary values. Any older text describing React Query is
outdated.

### Why adapter context pattern?

- **Dependency injection**: Clean separation of concerns
- **Testability**: Easy to provide mock adapters
- **Flexibility**: Swap implementations without code changes

Trade-off: Context setup complexity.

### Why error boundaries?

- **Graceful degradation**: App doesn't crash on errors
- **User experience**: Clear error states
- **Debugging**: Centralized error logging

Trade-off: Can't catch all error types (async errors need different handling).
