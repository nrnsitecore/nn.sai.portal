'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDemoPersonaOptions } from '@/lib/demo-personas';
import { DEMO_TAXONOMY_CHANGE_EVENT, DEMO_TAXONOMY_STORAGE_KEY } from '@/lib/demo-taxonomy';

export function DemoUserSwitcher() {
  const [taxonomy, setTaxonomy] = useState('');
  const demoUsers = useMemo(() => getDemoPersonaOptions(), []);

  useEffect(() => {
    const storedTaxonomy = window.localStorage.getItem(DEMO_TAXONOMY_STORAGE_KEY) ?? '';
    const valid = demoUsers.some((u) => u.taxonomy === storedTaxonomy);
    if (storedTaxonomy && !valid) {
      window.localStorage.removeItem(DEMO_TAXONOMY_STORAGE_KEY);
      setTaxonomy('');
      return;
    }
    setTaxonomy(storedTaxonomy);
  }, [demoUsers]);

  const handleValueChange = (value: string) => {
    setTaxonomy(value);
    window.localStorage.setItem(DEMO_TAXONOMY_STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(DEMO_TAXONOMY_CHANGE_EVENT, { detail: { taxonomy: value } }));
  };

  return (
    <Select value={taxonomy || undefined} onValueChange={handleValueChange}>
      <SelectTrigger className="h-10 w-[15rem]">
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
