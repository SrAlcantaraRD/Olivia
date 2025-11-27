import { Stack } from 'expo-router';

import { TabStack } from '@/ui/components/layouts/tab-stack.layout';

export default function DesignSystemLayout() {
  return (
    <TabStack>
      <Stack.Screen name="index" />
    </TabStack>
  );
}
