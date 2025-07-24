import { SharedValue, runOnJS } from 'react-native-reanimated';

import { Gesture } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { MessagePayload } from '@/lib/utils';

export const fourFingerTapGesture = (
  isWsConnected: SharedValue<boolean>,
  sendMessage: (message: MessagePayload) => void,
  router: ReturnType<typeof useRouter>
) =>
  Gesture.Tap()
    .numberOfTaps(1) // A single tap
    .minPointers(4)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      runOnJS(router.push)("/keyboard");
    });
