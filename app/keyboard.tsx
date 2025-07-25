import * as ScreenOrientation from "expo-screen-orientation";

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

import ArrowKeys from '@/lib/ArrowKeys';
import { KEYS } from '@/lib/KEYS';
import { KeyboardKey } from '@/components/KeyboardKey';
import { View } from 'react-native';
import { fourFingerSwipeEditsGesture } from '@/gestures/fourFingerSwipeEditsGesture';
import { threeFingerSwipeAppSwitchGesture } from '@/gestures/threeFingerSwipeAppSwitchGesture';
import { twoFingerSwipeArrowsGesture } from '@/gestures/twoFingerSwipeArrowsGesture';
import { useRouter } from 'expo-router';
import { useWebSocketContext } from '@/context/WebSocketContext';

export default function Keyboard() {
  const { sendMessage, isMac } = useWebSocketContext();
  const router = useRouter();
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.PORTRAIT_UP);

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then(setOrientation);
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const fourFingerEdits = fourFingerSwipeEditsGesture(orientation);
  const threeFingerAppSwitch = threeFingerSwipeAppSwitchGesture(orientation);
  const twoFingerArrows = twoFingerSwipeArrowsGesture(orientation);

  const combinedGestures = Gesture.Simultaneous(fourFingerEdits, threeFingerAppSwitch, twoFingerArrows);

  return (
    <GestureDetector gesture={combinedGestures}>
      <View className='flex-1 bg-neutral-900 justify-center items-center'>
        <View className='gap-1.5 portrait:rotate-90'>
          {KEYS(isMac).map((row, r) => (
            <View key={r} className='flex flex-row gap-1.5'>
              {row.map((key, i) => (
                <KeyboardKey {...key} key={i} sendMessage={sendMessage} router={router} />
              ))}
              {r === 5 && <ArrowKeys sendMessage={sendMessage} />}
            </View>
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}
