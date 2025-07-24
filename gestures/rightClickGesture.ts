import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import { MessagePayload } from '../lib/utils';

export const rightClickGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: MessagePayload) => void
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
