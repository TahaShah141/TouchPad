import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';

export const scrollGesture = (
  isWsConnected: SharedValue<boolean>,
  prevTwoFingerPanX: SharedValue<number>,
  prevTwoFingerPanY: SharedValue<number>,
  orientation: ScreenOrientation.Orientation,
  sendMessage: (message: { type: string; dx?: number; dy?: number; }) => void
) =>
  Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onStart((e) => {
      prevTwoFingerPanX.value = e.translationX;
      prevTwoFingerPanY.value = e.translationY;
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {
        let dx = e.translationX - prevTwoFingerPanX.value;
        let dy = e.translationY - prevTwoFingerPanY.value;

        prevTwoFingerPanX.value = e.translationX;
        prevTwoFingerPanY.value = e.translationY;

        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
          [dx, dy] = [dy, -dx];
        }

        runOnJS(sendMessage)({
          type: 'scroll',
          dx: dx,
          dy: dy,
        });
      }
    });
