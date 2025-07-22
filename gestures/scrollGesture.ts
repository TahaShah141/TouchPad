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

        // Calculate velocity magnitude
        const velocity = Math.sqrt(e.velocityX * e.velocityX + e.velocityY * e.velocityY);

        let sensitivityMultiplier = 1;
        const velocityThreshold = 500;
        const maxSensitivity = 3; // Example max sensitivity, can be adjusted
        const sensitivityGradient = 0.002; // Small steps for linear increase

        if (velocity > velocityThreshold) {
          sensitivityMultiplier = 1 + (velocity - velocityThreshold) * sensitivityGradient;
          // Cap the sensitivity to avoid extreme values
          sensitivityMultiplier = Math.min(sensitivityMultiplier, maxSensitivity);
        }

        dx *= sensitivityMultiplier;
        dy *= sensitivityMultiplier;

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
