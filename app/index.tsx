import * as ScreenOrientation from 'expo-screen-orientation';

import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { doubleClickGesture } from '@/gestures/doubleClickGesture';
import { fourFingerSwipeGesture } from '@/gestures/fourFingerSwipeGesture';
import { fourFingerTapGesture } from '@/gestures/fourFingerTapGesture';
import { leftClickGesture } from '@/gestures/leftClickGesture';
import { mouseMoveGesture } from '@/gestures/mouseMoveGesture';
import { rightClickGesture } from '@/gestures/rightClickGesture';
import { scrollGesture } from '@/gestures/scrollGesture';
import { threeFingerDragGesture } from '@/gestures/threeFingerDragGesture';
import { useWebSocket } from '@/lib/useWebSocket';
import { sendMessageWrapper } from "@/lib/utils";
import { MaterialIcons } from '@expo/vector-icons';
import { useSharedValue } from 'react-native-reanimated';

export default function Index() {
  const { isConnected, connectWebSocket, ws, isWsConnected, currentIp, log, requiresManualInput, setIpAndConnect, setRequiresManualInput } = useWebSocket();
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const [manualIp, setManualIp] = useState("");
  const prevPanX = useSharedValue(0);
  const prevPanY = useSharedValue(0);
  const prevTwoFingerPanX = useSharedValue(0);
  const prevTwoFingerPanY = useSharedValue(0);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);

  const sendMessage = sendMessageWrapper(ws)

  const composedGesture = Gesture.Race(
    fourFingerTapGesture(isWsConnected, sendMessage),
    doubleClickGesture(isWsConnected, sendMessage),
    rightClickGesture(isWsConnected, sendMessage),
    leftClickGesture(isWsConnected, sendMessage),
    fourFingerSwipeGesture(isWsConnected, orientation, sendMessage),
    mouseMoveGesture(isWsConnected, prevPanX, prevPanY, orientation, sendMessage),
    scrollGesture(isWsConnected, prevTwoFingerPanX, prevTwoFingerPanY, orientation, sendMessage),
    threeFingerDragGesture(isWsConnected, prevPanX, prevPanY, orientation, sendMessage),
  );

  return (
    <View className="flex-1 bg-neutral-900">
      <GestureDetector gesture={composedGesture}>
        <View className="flex-1 m-4 rounded-3xl bg-neutral-800 shadow-lg">
        </View>
      </GestureDetector>

      {log && 
      <View className="absolute bottom-8 left-6 right-6 rounded-md p-2 bg-black/30">
        <Text className="text-white text-center text-xs font-mono">{log}</Text>
      </View>}
      
      {/* Reconnect Button / Manual IP Input */}
      {!isConnected && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center">
          <View className="bg-neutral-900 w-full max-w-xs mx-8 rounded-xl p-6 border border-neutral-700">
            {!requiresManualInput ? (
              <>
                <MaterialIcons name="wifi-off" size={48} color="#d4d4d4" className="self-center mb-4" />
                <Text className="text-neutral-300 text-center mb-4">
                  Connection Lost
                </Text>
                <Text className="text-neutral-400 text-center text-xs mb-4">
                  Server IP: {currentIp ? currentIp : "Attempting to connect..."}
                </Text>
                <View className='flex flex-row gap-4'>
                  <TouchableOpacity
                    className="bg-neutral-700 flex-1 rounded-lg py-3 px-6"
                    onPress={() => setRequiresManualInput(true)}
                    >
                    <Text className="text-neutral-200 text-center">
                      Change IP
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-neutral-700 flex-1 rounded-lg py-3 px-6"
                    onPress={connectWebSocket}
                    >
                    <Text className="text-neutral-200 text-center">
                      Reconnect
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className="text-neutral-300 text-center mb-4 text-lg font-bold">
                  Connect to Server
                </Text>
                <Text className="text-neutral-400 text-center text-xs mb-4">
                  Enter Server IP or scan QR code from server terminal.
                </Text>
                <TextInput
                  className="w-full bg-neutral-700 text-white rounded-lg p-3 mb-4 text-center"
                  placeholder="Enter IP Address"
                  placeholderTextColor="#a3a3a3"
                  value={manualIp}
                  onChangeText={setManualIp}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  className="bg-neutral-700 rounded-lg py-3 px-6 w-full"
                  onPress={() => setIpAndConnect(manualIp)}
                >
                  <Text className="text-neutral-200 text-center">
                    Connect
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}