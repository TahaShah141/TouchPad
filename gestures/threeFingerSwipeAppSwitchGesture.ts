import * as ScreenOrientation from "expo-screen-orientation";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export const threeFingerSwipeAppSwitchGesture = (orientation: ScreenOrientation.Orientation) => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Pan()
    .minPointers(3)
    .maxPointers(3)
    .onEnd((e) => {
      if (isWsConnected) {
        const { translationX, translationY } = e;
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to be recognized

        let horizontalMovement = translationX;
        let verticalMovement = translationY;

        // Adjust movements based on orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP || orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
          horizontalMovement = translationY;
          verticalMovement = -translationX; // Invert X for vertical movement
        }

        if (Math.abs(horizontalMovement) > Math.abs(verticalMovement)) {
          // Horizontal swipe (Control + Tab / Control + Shift + Tab)
          if (horizontalMovement < -SWIPE_THRESHOLD) {
            // Swiped left
            runOnJS(sendMessage)({
              type: "custom",
              name: "nextTab",
            });
          } else if (horizontalMovement > SWIPE_THRESHOLD) {
            // Swiped right
            runOnJS(sendMessage)({
              type: "custom",
              name: "prevTab",
            });
          }
        } else {
          // Vertical swipe (Command + Tab / Command + Shift + Tab)
          if (verticalMovement < -SWIPE_THRESHOLD) {
            // Swiped up
            runOnJS(sendMessage)({
              type: "custom",
              name: "nextApp",
            });
          } else if (verticalMovement > SWIPE_THRESHOLD) {
            // Swiped down
            runOnJS(sendMessage)({
              type: "custom",
              name: "prevApp",
            });
          }
        }
      }
    });
};