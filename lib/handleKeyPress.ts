import { ModifierContextType } from "@/context/ModifierContext";
import { MessagePayload } from "./utils";

export const handleKeyPress = (
  keyCode: string,
  isModifier: boolean | undefined,
  sendMessage: (message: MessagePayload) => void,
  modifierContext: ModifierContextType
) => {
  const { modifiers, resetAllModifiers, toggleModifier, toggleAllStandardModifiers, isFnActive } = modifierContext;

  if (isModifier) {
    if (keyCode === 'capslock') {
      const isCapsActive = modifiers.get('capslock')
      toggleAllStandardModifiers(!isCapsActive);
    }
    toggleModifier(keyCode);
  } else {
    const activeModifiers: string[] = [];
    modifiers.forEach((isActive, name) => {
      if (isActive && name !== 'fn' && name !== 'capslock') {
        activeModifiers.push(name);
      }
    });

    sendMessage({
      type: "keyPress",
      keyCode,
      modifiers: activeModifiers.length > 0 ? activeModifiers : undefined,
    });

    if (!isFnActive) {
      resetAllModifiers()
    }
  }
};