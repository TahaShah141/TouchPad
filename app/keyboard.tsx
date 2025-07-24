import { KeyboardKey } from '@/components/KeyboardKey';
import ArrowKeys from '@/lib/ArrowKeys';
import { KEYS } from '@/lib/KEYS';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { twoFingerSwipeDeleteGesture } from '@/gestures/twoFingerSwipeDeleteGesture';
import { threeFingerSwipeAppSwitchGesture } from '@/gestures/threeFingerSwipeAppSwitchGesture';
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from 'react';

export default function Keyboard() {
  const { sendMessage } = useWebSocketContext();
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

  const twoFingerDelete = twoFingerSwipeDeleteGesture(orientation);
  const threeFingerAppSwitch = threeFingerSwipeAppSwitchGesture(orientation);

  const combinedGestures = Gesture.Simultaneous(twoFingerDelete, threeFingerAppSwitch);

  return (
    <GestureDetector gesture={combinedGestures}>
      <View className='flex-1 bg-neutral-900 justify-center items-center'>
        <View className='gap-1.5 portrait:rotate-90'>
          {KEYS.map((row, r) => (
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
