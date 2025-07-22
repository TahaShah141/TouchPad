import { SharedValue } from 'react-native-reanimated';

import { Gesture } from 'react-native-gesture-handler';

export const fourFingerTapGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: { type: string; msg: string }) => void
) =>
  Gesture.Tap()
    .numberOfTaps(1) // A single tap
    .minPointers(4)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      // if (isWsConnected.value) {
      //   runOnJS(sendMessage)({
      //     type: 'echo',
      //     msg: "Four Finger Tap"
      //   });
      // }
      console.log("Four Finger Tap") 
    });
