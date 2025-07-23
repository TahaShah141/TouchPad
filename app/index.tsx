import * as ScreenOrientation from 'expo-screen-orientation';

import { getMacIP, sendMessageWrapper } from "@/lib/utils";
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
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
import { MaterialIcons } from '@expo/vector-icons';
import { useSharedValue } from 'react-native-reanimated';

export default function Index() {
  const { isConnected, connectWebSocket, ws, isWsConnected, log, httpTestLog, testFetch } = useWebSocket();
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const [macIP, setMacIP] = useState<string | null>(null);
  const prevPanX = useSharedValue(0);
  const prevPanY = useSharedValue(0);
  const prevTwoFingerPanX = useSharedValue(0);
  const prevTwoFingerPanY = useSharedValue(0);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    const fetchIP = async () => {
      try {
        const ip = await getMacIP();
        setMacIP(ip);
      } catch (error) {
        console.error("Failed to fetch Mac IP:", error);
        setMacIP("N/A");
      }
    };

    fetchIP();

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
    fourFingerSwipeGesture(isWsConnected, sendMessage),
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

      <View className="absolute bottom-8 left-0 right-0 p-2 bg-black/30">
        <Text className="text-white text-center text-xs font-mono">{log}</Text>
      </View>

      <TouchableOpacity onPress={testFetch} className="absolute bottom-20 left-0 right-0 p-2 bg-black/30">
        <Text className="text-white text-center text-xs font-mono">{httpTestLog}</Text>
      </TouchableOpacity>
      
      {/* Reconnect Button */}
      {!isConnected && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center">
          <View className="bg-neutral-900 mx-8 rounded-xl p-6 border border-neutral-700">
            <MaterialIcons name="wifi-off" size={48} color="#d4d4d4" className="self-center mb-4" />
            <Text className="text-neutral-300 text-center mb-4">
              Connection Lost
            </Text>
            <Text className="text-neutral-400 text-center text-xs mb-4">
              Server IP: {macIP ? macIP : "Fetching IP"}
            </Text>
            <TouchableOpacity
              className="bg-neutral-700 rounded-lg py-3 px-6"
              onPress={connectWebSocket}
            >
              <Text className="text-neutral-200 text-center">
                Reconnect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}