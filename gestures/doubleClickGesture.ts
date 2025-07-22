import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';

export const doubleClickGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: { type: string; }) => void
) =>
  Gesture.Tap()
    .minPointers(3)
    .maxDuration(250)
    .maxDelay(300)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'doubleclick',
        });
      }
    });
