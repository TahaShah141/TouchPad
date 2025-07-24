import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { KeyType } from "@/lib/KEYS";
import { MessagePayload } from "@/lib/utils";
import { View } from "react-native";
import { runOnJS } from "react-native-reanimated";

export const KeyboardKey = ({display, width=1, keyCode, sendMessage}: KeyType & { sendMessage: (message: MessagePayload) => void}) => {

  const tapGesture = Gesture.Tap().onEnd(() => {
    console.log("TAP", keyCode)
    runOnJS(sendMessage)({ type: "keyPress", keyCode });
  });

  const swipeGesture = Gesture.Pan().activeOffsetY([30, Infinity]).activeOffsetX([-20, 20]).onEnd((event) => {
    if (event.translationY > 30) { // Swipe down
      runOnJS(sendMessage)({ type: "keyPress", keyCode, modifier: "shift" });
    }
  });

  const composedGesture = Gesture.Race(tapGesture, swipeGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <View className={`bg-neutral-800 h-14 border-black rounded-md px-2`} style={{ aspectRatio: `${width} / 1`}}>
        {display}
      </View>
    </GestureDetector>
  )
}