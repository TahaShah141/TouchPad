import { SharedValue, runOnJS } from 'react-native-reanimated';

import { Gesture } from 'react-native-gesture-handler';

export const fourFingerSwipeGesture = (
  isWsConnected: SharedValue<boolean>,
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
              direction: 'up',
            });
          } else if (translationX < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: 'down',
            });
          }
        } else {
          // Vertical swipe on device -> Horizontal space change
          if (translationY > SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: 'left',
            });
          } else if (translationY < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: 'spacechange',
              direction: 'right',
            });
          }
        }
      }
    });
