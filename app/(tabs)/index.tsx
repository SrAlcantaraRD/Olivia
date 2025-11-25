import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SQLITE_DB } from '@/ddbb/config/database.config';
import { useTasks } from '@/hooks/use-tasks';
import { TextTranslation } from '@/ui/components/atoms/text-translations.atom';
import { TypographyCode } from '@/ui/components/atoms/typography.atom';
import { HelloWave } from '@/ui/components/hello-wave';
import ParallaxScrollView from '@/ui/components/parallax-scroll-view';
import { ThemedText } from '@/ui/components/themed-text';
import { ThemedView } from '@/ui/components/themed-view';

export default function HomeScreen() {
  const { tasks, loading, error, populateFakeData } = useTasks();
  useDrizzleStudio(SQLITE_DB);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <Text className="text-xl font-bold text-primary mb-4">
        Welcome to Nativewind!
      </Text>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">PEC I</ThemedText>
        <TypographyCode>
          <TextTranslation i18nKey="welcome" />
        </TypographyCode>
        <HelloWave />
      </ThemedView>

      {/* Sección de Tareas */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📝 Mis Tareas</ThemedText>

        <Pressable style={styles.button} onPress={populateFakeData}>
          <ThemedText style={styles.buttonText}>
            Poblar con datos de prueba
          </ThemedText>
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <ThemedText style={{ color: 'red' }}>
            Error: {error.message}
          </ThemedText>
        ) : tasks.length === 0 ? (
          <ThemedText>
            No hay tareas. Pulsa el botón para añadir datos de prueba.
          </ThemedText>
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <ThemedText type="defaultSemiBold">{task.title}</ThemedText>
                <ThemedText style={styles.taskDescription}>
                  {task.description}
                </ThemedText>
                <ThemedText style={styles.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString('es-ES')}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Entregarla</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <TypographyCode>
              <TextTranslation i18nKey="welcome" />
            </TypographyCode>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert('Action pressed')}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{' '}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  taskList: {
    gap: 12,
    marginTop: 8,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    gap: 4,
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  taskDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
