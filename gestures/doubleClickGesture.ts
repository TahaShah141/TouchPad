import { runOnJS } from "react-native-reanimated";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";

export const doubleClickGesture = () => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Tap()
    .minPointers(3)
    .maxDuration(250)
    .maxDelay(300)
    .onEnd(() => {
      if (isWsConnected) {
        runOnJS(sendMessage)({
          type: "doubleclick",
        });
      }
    });
};
