import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import { MessagePayload } from '../lib/utils';

export const leftClickGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: MessagePayload) => void
) =>
  Gesture.Tap()
    .maxDuration(250)
    .maxDeltaX(5)
    .maxDeltaY(5)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'click',
        });
      }
    });
