"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface TerminalModeContextType {
  isTerminal: boolean;
  toggle: () => void;
}

const TerminalModeContext = createContext<TerminalModeContextType>({
  isTerminal: false,
  toggle: () => {},
});

export function useTerminalMode() {
  return useContext(TerminalModeContext);
}

export function TerminalModeProvider({ children }: { children: ReactNode }) {
  const [isTerminal, setIsTerminal] = useState(false);

  const toggle = useCallback(() => {
    setIsTerminal((prev) => {
      const next = !prev;
      document.body.classList.toggle("terminal-mode", next);
      return next;
    });
  }, []);

  return (
    <TerminalModeContext.Provider value={{ isTerminal, toggle }}>
      {children}
    </TerminalModeContext.Provider>
  );
}
