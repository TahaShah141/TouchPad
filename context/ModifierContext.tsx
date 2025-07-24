import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

export interface ModifierContextType {
  modifiers: Map<string, boolean>;
  resetAllModifiers: () => void
  toggleModifier: (modifierName: string) => void;
  toggleAllStandardModifiers: (newState :boolean) => void;
  isFnActive: boolean;
}

const ModifierContext = createContext<ModifierContextType | undefined>(undefined);

export const ModifierProvider = ({ children }: { children: ReactNode }) => {
  const [modifiers, setModifiers] = useState<Map<string, boolean>>(new Map());
  const [isFnActive, setIsFnActive] = useState<boolean>(false);

  const toggleModifier = (modifierName: string) => {
    setModifiers((prev) => {
      const newMap = new Map(prev);
      const newState = !newMap.get(modifierName);

      if (modifierName === 'fn') {
        setIsFnActive(newState);
        if (!newState) {
          return new Map(); // Return a completely new empty map if fn is being deactivated
        }
      }
      newMap.set(modifierName, newState); // Set the state for the current modifier
      return newMap;
    });
  };

  const toggleAllStandardModifiers = (newState: boolean) => {
    setModifiers((prev) => {
      const newMap = new Map(prev);
      const standardModifiers = ['command', 'control', 'alt', 'shift'];
      standardModifiers.forEach(mod => {
        newMap.set(mod, newState);
      });
      return newMap;
    });
  };

  const resetAllModifiers = () => {
    setModifiers(new Map())
  }

  const contextValue = useMemo(
    () => ({
      modifiers,
      resetAllModifiers,
      toggleModifier,
      toggleAllStandardModifiers,
      isFnActive,
    }),
    [modifiers, resetAllModifiers, toggleModifier, toggleAllStandardModifiers, isFnActive]
  );

  return (
    <ModifierContext.Provider value={contextValue}>
      {children}
    </ModifierContext.Provider>
  );
};

export const useModifiers = () => {
  const context = useContext(ModifierContext);
  if (context === undefined) {
    throw new Error('useModifiers must be used within a ModifierProvider');
  }
  return context;
};