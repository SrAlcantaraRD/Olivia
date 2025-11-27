import { StyleSheet } from 'react-native';

import { Fonts } from '@/constants/theme';
import { Typography } from '@/ui/components/atoms/typography.atom';
import { ExternalLink } from '@/ui/components/external-link';
import ParallaxScrollView from '@/ui/components/parallax-scroll-view';
import { ThemedView } from '@/ui/components/themed-view';
import { Collapsible } from '@/ui/components/ui/collapsible';
import { IconSymbol } from '@/ui/components/ui/icon-symbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Typography
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore
        </Typography>
      </ThemedView>
      <Typography>
        This app includes example code to help you get started.
      </Typography>
      <Collapsible title="File-based routing">
        <Typography>
          This app has two screens:{' '}
          <Typography>app/(tabs)/index.tsx</Typography> and{' '}
          <Typography>app/(tabs)/explore.tsx</Typography>
        </Typography>
        <Typography>
          The layout file in <Typography>app/(tabs)/_layout.tsx</Typography>{' '}
          sets up the tab navigator.
        </Typography>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Typography>Learn more</Typography>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Typography>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <Typography>w</Typography> in the terminal running
          this project.
        </Typography>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
