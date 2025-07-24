import { useModifiers } from "@/context/ModifierContext";
import { KeyType } from "@/lib/KEYS";
import { MessagePayload } from "@/lib/utils";
import { useRouter } from 'expo-router';
import { TouchableOpacity } from "react-native";
import { handleKeyPress } from "../lib/handleKeyPress";

export const KeyboardKey = ({display, width=1, keyCode, isModifier, sendMessage, router}: KeyType & { sendMessage: (message: MessagePayload) => void, router: ReturnType<typeof useRouter>}) => {
  const modifierContext = useModifiers();
  const isActiveModifier = isModifier && modifierContext.modifiers.get(keyCode);

  const handlePress = () => {
    if (keyCode === 'power') {
      router.push('/');
    } else {
      handleKeyPress(keyCode, isModifier, sendMessage, modifierContext);
    }2
  };

  return (
    <TouchableOpacity onPress={handlePress} className={`bg-neutral-800 border h-14 rounded-md px-2 ${isActiveModifier ? 'border-white' : 'border-neutral-800'}`} style={{ aspectRatio: `${width} / 1`}} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      {display}
    </TouchableOpacity>
  )
}