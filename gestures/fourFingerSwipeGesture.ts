import * as ScreenOrientation from "expo-screen-orientation";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export const fourFingerSwipeGesture = (
  orientation: ScreenOrientation.Orientation
) => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Pan()
    .minPointers(4)
    .maxPointers(4)
    .onEnd(e => {
      if (isWsConnected) {
        const { translationX, translationY } = e;
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to be recognized

        if (Math.abs(translationX) > Math.abs(translationY)) {
          // Horizontal swipe on device -> Vertical space change
          if (translationX > SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: "spacechange",
              direction:
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP
                  ? "up"
                  : "left",
            });
          } else if (translationX < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: "spacechange",
              direction:
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP
                  ? "down"
                  : "right",
            });
          }
        } else {
          // Vertical swipe on device -> Horizontal space change
          if (translationY > SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: "spacechange",
              direction:
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP
                  ? "left"
                  : "down",
            });
          } else if (translationY < -SWIPE_THRESHOLD) {
            runOnJS(sendMessage)({
              type: "spacechange",
              direction:
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP
                  ? "right"
                  : "up",
            });
          }
        }
      }
    });
};
