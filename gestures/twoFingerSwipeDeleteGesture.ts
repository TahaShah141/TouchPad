import * as ScreenOrientation from "expo-screen-orientation";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export const twoFingerSwipeDeleteGesture = (orientation: ScreenOrientation.Orientation) => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onEnd((e) => {
      if (isWsConnected) {
        const { translationX, translationY } = e;
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to be recognized

        let horizontalMovement = translationX;
        let verticalMovement = translationY;

        // Adjust movements based on orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP || orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
          // In portrait, device's X is app's Y, and device's Y is app's X (but inverted for X)
          horizontalMovement = translationY;
          verticalMovement = -translationX; // Invert X for vertical movement
        }

        if (Math.abs(horizontalMovement) > Math.abs(verticalMovement)) {
          // Horizontal swipe
          if (horizontalMovement < -SWIPE_THRESHOLD) {
            // Swiped left
            runOnJS(sendMessage)({
              type: "keyPress",
              keyCode: "backspace",
            });
          } else if (horizontalMovement > SWIPE_THRESHOLD) {
            // Swiped right
            runOnJS(sendMessage)({
              type: "keyPress",
              keyCode: "delete",
            });
          }
        } else {
          // Vertical swipe
          if (verticalMovement < -SWIPE_THRESHOLD) {
            // Swiped up (Redo: Command + Shift + Z)
            runOnJS(sendMessage)({
              type: "keyPress",
              keyCode: "z",
              modifiers: ["command", "shift"],
            });
          } else if (verticalMovement > SWIPE_THRESHOLD) {
            // Swiped down (Undo: Command + Z)
            runOnJS(sendMessage)({
              type: "keyPress",
              keyCode: "z",
              modifiers: ["command"],
            });
          }
        }
      }
    });
};