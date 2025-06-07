import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IndexScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome!
      </ThemedText>
      <View style={styles.links}>
        <Link href="/ai-chat" style={styles.link}>
          <ThemedText type="subtitle">Go to AI Chat</ThemedText>
        </Link>
        <Link href="/live-guide" style={styles.link}>
          <ThemedText type="subtitle">Go to Live Guide</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 32,
  },
  links: {
    gap: 24,
  },
  link: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 8,
    alignItems: 'center',
  },
});
