import * as ScreenOrientation from 'expo-screen-orientation';

import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { doubleClickGesture } from '@/gestures/doubleClickGesture';
import { fourFingerSwipeGesture } from '@/gestures/fourFingerSwipeGesture';
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
  const { isConnected, connectWebSocket, ws, isWsConnected } = useWebSocket();
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
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

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);

  const composedGesture = Gesture.Race(
    doubleClickGesture(isWsConnected, sendMessage),
    rightClickGesture(isWsConnected, sendMessage),
    leftClickGesture(isWsConnected, sendMessage),
    fourFingerSwipeGesture(isWsConnected, sendMessage),
    mouseMoveGesture(isWsConnected, prevPanX, prevPanY, orientation, sendMessage),
    scrollGesture(isWsConnected, prevTwoFingerPanX, prevTwoFingerPanY, orientation, sendMessage),
    threeFingerDragGesture(isWsConnected, prevPanX, prevPanY, orientation, sendMessage)
  );

  return (
    <View className="flex-1 bg-neutral-900">
      <GestureDetector gesture={composedGesture}>
        <View className="flex-1 m-4 rounded-3xl bg-neutral-800 shadow-lg">
        </View>
      </GestureDetector>
      
      {/* Reconnect Button */}
      {!isConnected && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center">
          <View className="bg-neutral-900 mx-8 rounded-xl p-6 border border-neutral-700">
            <MaterialIcons name="wifi-off" size={48} color="#d4d4d4" className="self-center mb-4" />
            <Text className="text-neutral-300 text-center mb-4">
              Connection Lost
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

