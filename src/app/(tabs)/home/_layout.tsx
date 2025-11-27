import { Stack } from 'expo-router';

import { TabStack } from '@/ui/components/layouts/tab-stack.layout';

export default function HomeLayout() {
  return (
    <TabStack>
      <Stack.Screen name="index" />
    </TabStack>
  );
}
