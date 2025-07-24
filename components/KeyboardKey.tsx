import { useModifiers } from "@/context/ModifierContext";
import { KeyType } from "@/lib/KEYS";
import { MessagePayload } from "@/lib/utils";
import { TouchableOpacity } from "react-native";
import { handleKeyPress } from "../lib/handleKeyPress";

export const KeyboardKey = ({display, width=1, keyCode, isModifier, sendMessage}: KeyType & { sendMessage: (message: MessagePayload) => void}) => {
  const modifierContext = useModifiers();
  const isActiveModifier = isModifier && modifierContext.modifiers.get(keyCode);

  return (
    <TouchableOpacity onPress={() => handleKeyPress(keyCode, isModifier, sendMessage, modifierContext)} className={`bg-neutral-800 border h-14 rounded-md px-2 ${isActiveModifier ? 'border-white' : 'border-neutral-800'}`} style={{ aspectRatio: `${width} / 1`}} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      {display}
    </TouchableOpacity>
  )
}