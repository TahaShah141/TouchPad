import * as ScreenOrientation from 'expo-screen-orientation';

import { SharedValue, runOnJS } from 'react-native-reanimated';

import { Gesture } from 'react-native-gesture-handler';

export const fourFingerSwipeGesture = (
  isWsConnected: SharedValue<boolean>,
  orientation: ScreenOrientation.Orientation,
  sendMessage: (message: { type: string; direction?: 'up' | 'down' | 'left' | 'right' }) => void
) =>
  Gesture.Pan()
    .minPointers(4)
    .maxPointers(4)
    .onEnd((e) => {
      if (isWsConnected.value) {
        const { translationX, translationY } = e;
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to be recognized

        if (Math.abs(translationX) > Math.abs(translationY)) {
          // Horizontal swipe on device -> Vertical space change
          if (translationX > SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 'up' : 'right',
            });
          } else if (translationX < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 'down' : 'left',
            });
          }
        } else {
          // Vertical swipe on device -> Horizontal space change
          if (translationY > SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 'left' : 'up',
            });
          } else if (translationY < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 'right' : 'down',
            });
          }
        }
      }
    });
