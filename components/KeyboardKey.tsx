import { KeyType } from "@/lib/KEYS";
import { View } from "react-native";

export const KeyboardKey = ({display, width=1}: KeyType) => {
  return (
    <View className={`bg-neutral-800 h-14 border-black rounded-md px-2`} style={{ aspectRatio: `${width} / 1`}}>
      {display}
    </View>
  )
}