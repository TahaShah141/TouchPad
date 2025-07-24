import * as ScreenOrientation from 'expo-screen-orientation';

import React, { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { doubleClickGesture } from '@/gestures/doubleClickGesture';
import { fourFingerSwipeGesture } from '@/gestures/fourFingerSwipeGesture';
import { fourFingerTapGesture } from '@/gestures/fourFingerTapGesture';
import { leftClickGesture } from '@/gestures/leftClickGesture';
import { mouseMoveGesture } from '@/gestures/mouseMoveGesture';
import { rightClickGesture } from '@/gestures/rightClickGesture';
import { scrollGesture } from '@/gestures/scrollGesture';
import { threeFingerDragGesture } from '@/gestures/threeFingerDragGesture';
import { useRouter } from 'expo-router';
import { View } from "react-native";
import { useSharedValue } from 'react-native-reanimated';

export default function Index() {
  const router = useRouter();
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

  const composedGesture = Gesture.Race(
    fourFingerTapGesture(router),
    doubleClickGesture(),
    rightClickGesture(),
    leftClickGesture(),
    fourFingerSwipeGesture(orientation),
    mouseMoveGesture(prevPanX, prevPanY, orientation),
    scrollGesture(prevTwoFingerPanX, prevTwoFingerPanY, orientation),
    threeFingerDragGesture(prevPanX, prevPanY, orientation),
  );

  return (
    <View className="flex-1 bg-neutral-900">
      <GestureDetector gesture={composedGesture}>
        <View className="flex-1 m-4 rounded-3xl bg-neutral-800 shadow-lg">
        </View>
      </GestureDetector>
    </View>
  );
}