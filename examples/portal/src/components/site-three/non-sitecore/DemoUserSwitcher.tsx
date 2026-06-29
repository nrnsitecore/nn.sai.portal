'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDemoPersonaContext } from '@/contexts/DemoPersonaContext';
import type { DemoPersonaOption } from '@/lib/demo-personas';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';

type DemoUserSwitcherProps = {
  /** When the header datasource defines User1/User2 fields, those personas override context defaults */
  headerPersonas?: readonly DemoPersonaOption[] | null;
};

export function DemoUserSwitcher({ headerPersonas }: DemoUserSwitcherProps) {
  const [taxonomy, setTaxonomy] = useState('');
  const { personas: contextPersonas } = useDemoPersonaContext();

  const demoUsers = useMemo(() => {
    if (headerPersonas && headerPersonas.length >= 2) return headerPersonas;
    return contextPersonas;
  }, [contextPersonas, headerPersonas]);

  const personaKey = useMemo(() => demoUsers.map((u) => u.taxonomy).join('|'), [demoUsers]);

  useEffect(() => {
    const storedTaxonomy = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
    const valid = demoUsers.some((u) => u.taxonomy === storedTaxonomy);
    if (storedTaxonomy && !valid) {
      window.localStorage.removeItem(DEMO_TAXONOMY_STORAGE_KEY);
      setTaxonomy('');
      window.dispatchEvent(new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: '' } }));
      return;
    }
    setTaxonomy(storedTaxonomy);
  }, [demoUsers, personaKey]);

  const handleValueChange = (value: string) => {
    setTaxonomy(value);
    window.localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: value } }));
  };

  return (
    <Select value={taxonomy} onValueChange={handleValueChange}>
      <SelectTrigger className="h-10 min-w-[14rem] max-w-[22rem]">
        <SelectValue placeholder="Login" />
      </SelectTrigger>
      <SelectContent align="end">
        {demoUsers.map((user) => (
          <SelectItem key={user.taxonomy} value={user.taxonomy}>
            {user.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
