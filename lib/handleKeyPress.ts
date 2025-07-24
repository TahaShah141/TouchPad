import { MessagePayload } from "./utils";

interface ModifierContextProps {
  modifiers: Map<string, boolean>;
  toggleModifier: (modifierName: string) => void;
  resetModifiers: () => void;
}

export const handleKeyPress = (
  keyCode: string,
  isModifier: boolean | undefined,
  sendMessage: (message: MessagePayload) => void,
  modifierContext: ModifierContextProps
) => {
  const { modifiers, toggleModifier, resetModifiers } = modifierContext;

  if (isModifier) {
    toggleModifier(keyCode);
  } else {
    const activeModifiers: string[] = [];
    modifiers.forEach((isActive, name) => {
      if (isActive) {
        activeModifiers.push(name);
      }
    });

    sendMessage({
      type: "keyPress",
      keyCode,
      modifiers: activeModifiers.length > 0 ? activeModifiers : undefined,
    });
    resetModifiers();
  }
};