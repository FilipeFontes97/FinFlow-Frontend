import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CalculatorContextValue = {
  open: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;
  toggleCalculator: () => void;
};

const CalculatorContext = createContext<CalculatorContextValue | undefined>(undefined);

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openCalculator = useCallback(() => setOpen(true), []);
  const closeCalculator = useCallback(() => setOpen(false), []);
  const toggleCalculator = useCallback(() => setOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ open, openCalculator, closeCalculator, toggleCalculator }),
    [open, openCalculator, closeCalculator, toggleCalculator]
  );

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
