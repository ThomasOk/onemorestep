//import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// import { APIProvider } from '@/api';
// import { useThemeConfig } from '@/lib';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

// Empêcher l'écran de démarrage de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </>
  );
}

// function Providers({ children }) {
//   return <View style={styles.container}>{children}</View>;
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
