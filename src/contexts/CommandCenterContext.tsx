import { createContext, useContext, useState, ReactNode } from 'react';

interface CommandCenterContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandCenterContext = createContext<CommandCenterContextType | undefined>(undefined);

export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CommandCenterContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const context = useContext(CommandCenterContext);
  if (context === undefined) {
    throw new Error('useCommandCenter must be used within a CommandCenterProvider');
  }
  return context;
}

