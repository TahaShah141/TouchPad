import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';

import { ConnectivityModal } from '@/components/ConnectivityModal';
import { ModifierProvider } from '@/context/ModifierContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SFPro-Regular': require('../assets/fonts/SF-Pro.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ModifierProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WebSocketProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="keyboard" options={{ title: "Keyboard" }} />
          </Stack>
          <ConnectivityModal />
        </WebSocketProvider>
      </GestureHandlerRootView>
    </ModifierProvider>
  );
}
