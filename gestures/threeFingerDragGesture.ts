import * as ScreenOrientation from 'expo-screen-orientation';

import { SharedValue, runOnJS } from 'react-native-reanimated';

import { Gesture } from 'react-native-gesture-handler';

export const threeFingerDragGesture = (
  isWsConnected: SharedValue<boolean>,
  prevPanX: SharedValue<number>,
  prevPanY: SharedValue<number>,
  orientation: ScreenOrientation.Orientation,
  sendMessage: (message: { type: string; dx?: number; dy?: number; }) => void
) =>
  Gesture.Pan()
    .minPointers(3)
    .maxPointers(3)
    .onStart((e) => {
      prevPanX.value = e.translationX;
      prevPanY.value = e.translationY;
      runOnJS(sendMessage)({
        type: 'mousedown',
      });
    })
    .onEnd(() => {
      runOnJS(sendMessage)({
        type: 'mouseup',
      });
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
          type: 'threefingerdrag',
          dx: dx,
          dy: dy,
        });
      }
    });