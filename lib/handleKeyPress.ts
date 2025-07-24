import { MessagePayload } from "./utils";

interface ModifierContextProps {
  modifiers: Map<string, boolean>;
  toggleModifier: (modifierName: string) => void;
  toggleAllStandardModifiers: () => void;
  isFnActive: boolean;
}

export const handleKeyPress = (
  keyCode: string,
  isModifier: boolean | undefined,
  sendMessage: (message: MessagePayload) => void,
  modifierContext: ModifierContextProps
) => {
  const { modifiers, toggleModifier, toggleAllStandardModifiers, isFnActive } = modifierContext;

  if (isModifier) {
    if (keyCode === 'capslock') {
      toggleAllStandardModifiers();
    } else {
      toggleModifier(keyCode);
    }
  } else {
    const activeModifiers: string[] = [];
    modifiers.forEach((isActive, name) => {
      if (isActive && name !== 'fn') {
        activeModifiers.push(name);
      }
    });

    sendMessage({
      type: "keyPress",
      keyCode,
      modifiers: activeModifiers.length > 0 ? activeModifiers : undefined,
    });

    if (!isFnActive) {
      // Modifiers are now reset within ModifierContext when fn is deactivated
    }
  }
};