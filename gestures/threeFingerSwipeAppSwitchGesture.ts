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

        // Adjust horizontal movement based on orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP || orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
          horizontalMovement = translationY;
        }

        if (horizontalMovement < -SWIPE_THRESHOLD) {
          // Swiped left (Control + Tab)
          runOnJS(sendMessage)({
            type: "keyPress",
            keyCode: "tab",
            modifiers: ["control"],
          });
        } else if (horizontalMovement > SWIPE_THRESHOLD) {
          // Swiped right (Control + Shift + Tab)
          runOnJS(sendMessage)({
            type: "keyPress",
            keyCode: "tab",
            modifiers: ["control", "shift"],
          });
        }
      }
    });
};