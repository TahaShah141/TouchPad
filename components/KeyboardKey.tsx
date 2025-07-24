import { KeyType } from "@/lib/KEYS";
import { MessagePayload } from "@/lib/utils";
import { TouchableOpacity } from "react-native";

export const KeyboardKey = ({display, width=1, keyCode, sendMessage}: KeyType & { sendMessage: (message: MessagePayload) => void}) => {

  return (
    <TouchableOpacity onPress={() => sendMessage({ type: 'keyPress', keyCode })} className={`bg-neutral-800 h-14 border-black rounded-md px-2`} style={{ aspectRatio: `${width} / 1`}} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      {display}
    </TouchableOpacity>
  )
}