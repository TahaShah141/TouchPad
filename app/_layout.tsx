import '@/global.css';

import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { ConnectivityModal } from '@/components/ConnectivityModal';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WebSocketProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="keyboard" options={{ title: "Keyboard" }} />
        </Stack>
        <ConnectivityModal />
      </WebSocketProvider>
    </GestureHandlerRootView>
  );
}
