import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';

export const mouseMoveGesture = (
  isWsConnected: SharedValue<boolean>,
  prevPanX: SharedValue<number>,
  prevPanY: SharedValue<number>,
  orientation: ScreenOrientation.Orientation,
  sendMessage: (message: { type: string; dx?: number; dy?: number; }) => void
) =>
  Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onStart((e) => {
      prevPanX.value = e.translationX;
      prevPanY.value = e.translationY;
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {
        let dx = e.translationX - prevPanX.value;
        let dy = e.translationY - prevPanY.value;

        prevPanX.value = e.translationX;
        prevPanY.value = e.translationY;

        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
          [dx, dy] = [dy, -dx];
        }

        runOnJS(sendMessage)({
          type: 'mousemove',
          dx: dx,
          dy: dy,
        });
      }
    });
