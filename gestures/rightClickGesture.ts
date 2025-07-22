import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';

export const rightClickGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: { type: string; }) => void
) =>
  Gesture.Tap()
    .minPointers(2)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'rightclick',
        });
      }
    });
