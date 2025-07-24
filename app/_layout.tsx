import '@/global.css';

import { ConnectivityModal } from '@/components/ConnectivityModal';
import { ModifierProvider } from '@/context/ModifierContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
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
