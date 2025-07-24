import { runOnJS } from "react-native-reanimated";

import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";

export const leftClickGesture = () => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Tap()
    .maxDuration(250)
    .maxDeltaX(5)
    .maxDeltaY(5)
    .onEnd(() => {
      if (isWsConnected) {
        runOnJS(sendMessage)({
          type: "click",
        });
      }
    });
};
