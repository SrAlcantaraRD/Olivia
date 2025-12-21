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
      <TypographyTitle testID="screen.modal.title" i18nKey="modal.title" />
      <Link href="/(tabs)/register" dismissTo style={styles.link}>
        <TypographySubtitle
          testID="screen.modal.go-home"
          i18nKey="modal.go-home"
        />
      </Link>
    </ThemedView>
  );
}

// TODO: Remove all StyleSheet and use className only
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
