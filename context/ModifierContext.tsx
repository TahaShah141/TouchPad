import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface ModifierContextType {
  modifiers: Map<string, boolean>;
  toggleModifier: (modifierName: string) => void;
  resetModifiers: () => void;
}

const ModifierContext = createContext<ModifierContextType | undefined>(undefined);

export const ModifierProvider = ({ children }: { children: ReactNode }) => {
  const [modifiers, setModifiers] = useState<Map<string, boolean>>(new Map());

  const toggleModifier = (modifierName: string) => {
    setModifiers((prev) => {
      const newMap = new Map(prev);
      newMap.set(modifierName, !newMap.get(modifierName));
      return newMap;
    });
  };

  const resetModifiers = () => {
    setModifiers(new Map());
  };

  const contextValue = useMemo(
    () => ({
      modifiers,
      toggleModifier,
      resetModifiers,
    }),
    [modifiers, toggleModifier, resetModifiers]
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