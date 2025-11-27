import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import {
  TypographySubtitle,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { ThemedView } from '@/ui/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <TypographyTitle>This is a modal</TypographyTitle>
      <Link href="/(tabs)/home" dismissTo style={styles.link}>
        <TypographySubtitle>Go to home screen</TypographySubtitle>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
