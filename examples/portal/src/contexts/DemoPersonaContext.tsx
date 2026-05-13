'use client';

import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { getDemoPersonaOptions, type DemoPersonaOption } from '@/lib/demo-personas';

type DemoPersonaContextValue = {
  personas: readonly DemoPersonaOption[];
  setPersonas: (next: readonly DemoPersonaOption[]) => void;
};

const DemoPersonaContext = createContext<DemoPersonaContextValue | null>(null);

export function DemoPersonaProvider({ children }: { children: React.ReactNode }) {
  const [personas, setPersonasState] = useState<readonly DemoPersonaOption[]>(() => getDemoPersonaOptions());

  const setPersonas = useCallback((next: readonly DemoPersonaOption[]) => {
    setPersonasState(next.length > 0 ? next : getDemoPersonaOptions());
  }, []);

  const value = useMemo(() => ({ personas, setPersonas }), [personas, setPersonas]);

  return <DemoPersonaContext.Provider value={value}>{children}</DemoPersonaContext.Provider>;
}

export function useDemoPersonaContext(): DemoPersonaContextValue {
  const ctx = useContext(DemoPersonaContext);
  if (!ctx) {
    return {
      personas: getDemoPersonaOptions(),
      setPersonas: () => {},
    };
  }
  return ctx;
}
