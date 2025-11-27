import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { SQLITE_DB } from '@/ddbb/config/database.config';
import { useTasks } from '@/hooks/use-tasks';
import { ButtonAtom } from '@/ui/components/atoms/button.atom';
import { SpinnerAtom } from '@/ui/components/atoms/spinner.atom';
import { TextFieldAtom } from '@/ui/components/atoms/text-field.atom';
import {
  Typography,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { HelloWave } from '@/ui/components/hello-wave';
import ParallaxScrollView from '@/ui/components/parallax-scroll-view';
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
      <TypographyTitle i18nKey="welcome" />
      <ThemedView style={styles.titleContainer}>
        <Typography>PEC IV</Typography>
        <HelloWave />
      </ThemedView>

      {/* Sección de Tareas */}
      <ThemedView style={styles.stepContainer}>
        <Typography>📝 Mis Tareas</Typography>
        <ButtonAtom testID="test-button-hola" title="add-register" />
        <SpinnerAtom size="lg" />
        <TextFieldAtom />

        <Pressable style={styles.button} onPress={populateFakeData}>
          <Typography style={styles.buttonText}>
            Poblar con datos de prueba
          </Typography>
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Typography style={{ color: 'red' }}>
            Error: {error.message}
          </Typography>
        ) : tasks.length === 0 ? (
          <Typography>
            No hay tareas. Pulsa el botón para añadir datos de prueba.
          </Typography>
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Typography>{task.title}</Typography>
                <Typography style={styles.taskDescription}>
                  {task.description}
                </Typography>
                <Typography style={styles.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </View>
            ))}
          </View>
        )}
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
