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

        const velocity = Math.sqrt(e.velocityX * e.velocityX + e.velocityY * e.velocityY);

        let sensitivityMultiplier = 1;
        const lowVelocityThreshold = 200;
        const highVelocityThreshold = 500;
        const maxSensitivity = 3;
        const minSensitivity = 0.75; // Example min sensitivity for slow speeds
        const lowSensitivityGradient = 0.0005; // Small steps for linear decrease
        const highSensitivityGradient = 0.001; // Small steps for linear increase

        if (velocity < lowVelocityThreshold) {
          sensitivityMultiplier = 1 - (lowVelocityThreshold - velocity) * lowSensitivityGradient;
          sensitivityMultiplier = Math.max(sensitivityMultiplier, minSensitivity);
        } else if (velocity > highVelocityThreshold) {
          sensitivityMultiplier = 1 + (velocity - highVelocityThreshold) * highSensitivityGradient;
          sensitivityMultiplier = Math.min(sensitivityMultiplier, maxSensitivity);
        }

        dx *= sensitivityMultiplier;
        dy *= sensitivityMultiplier;

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