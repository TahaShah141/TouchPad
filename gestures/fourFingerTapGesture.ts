import { useRouter } from "expo-router";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export const fourFingerTapGesture = (router: ReturnType<typeof useRouter>) => {
  return Gesture.Tap()
    .numberOfTaps(1) // A single tap
    .minPointers(4)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      runOnJS(router.push)("/keyboard");
    });
};
