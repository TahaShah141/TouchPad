import { useWebSocketContext } from "@/context/WebSocketContext";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export const rightClickGesture = () => {
  const { isWsConnected, sendMessage } = useWebSocketContext();
  return Gesture.Tap()
    .minPointers(2)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      if (isWsConnected) {
        runOnJS(sendMessage)({
          type: "rightclick",
        });
      }
    });
};
