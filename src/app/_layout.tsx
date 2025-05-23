//import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

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
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
          <Toaster
            position="top-center"
            swipeToDismissDirection="up"
            closeButton={true}
            toastOptions={{
              style: {
                backgroundColor: '#111111',
                borderWidth: 1,
                borderColor: '#FFFFFF',
                borderRadius: 8,
                // shadowColor: '#000000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.8,
                // shadowRadius: 4,
                elevation: 5, // Pour Android
              },
              titleStyle: {
                color: '#FFFFFF',
                fontFamily: 'DotGothic16_400Regular', // Utilisez votre police pixel
                fontSize: 16,
              },
              descriptionStyle: {
                color: '#CCCCCC',
                fontFamily: 'DotGothic16_400Regular',
                fontSize: 14,
              },
            }}
          />
        </GestureHandlerRootView>
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
