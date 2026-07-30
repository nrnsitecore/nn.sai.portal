'use client';

import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { ReactNode, createContext, useContext } from 'react';

interface MegaMenuContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const MegaMenuContext = createContext<MegaMenuContextType | null>(null);

const useMegaMenu = (menuId: string) => {
  const context = useContext(MegaMenuContext);
  if (!context) {
    throw new Error(`MegaMenu components must be used within MegaMenuToggle (${menuId})`);
  }
  return context;
};

interface MegaMenuToggleProps {
  menuId: string;
  className?: string;
  trigger: ReactNode;
  children: ReactNode;
}

export const MegaMenuToggle = ({ className, trigger, children }: MegaMenuToggleProps) => {
  const { isVisible, setIsVisible, ref: menuRef } = useToggleWithClickOutside<HTMLLIElement>(false);

  return (
    <MegaMenuContext.Provider value={{ isVisible, setIsVisible }}>
      <li ref={menuRef} className={className} data-class-change>
        <span
          className={`text-foreground hover:text-primary relative inline-block cursor-pointer whitespace-nowrap px-4 py-5 font-[inherit] transition-colors after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:transition-colors ${
            isVisible ? 'text-primary after:bg-primary' : 'after:bg-transparent'
          }`}
          onClick={() => setIsVisible(!isVisible)}
        >
          {trigger}
        </span>
        {children}
      </li>
    </MegaMenuContext.Provider>
  );
};

interface MegaMenuContentProps {
  menuId: string;
  children: ReactNode;
}

export const MegaMenuContent = ({ menuId, children }: MegaMenuContentProps) => {
  const { isVisible } = useMegaMenu(menuId);

  return (
    <div
      className={`fixed lg:absolute top-20 left-0 right-0 lg:top-full lg:left-0 lg:right-0
        h-[calc(100vh-5rem)] lg:h-auto overflow-auto
        ${
          isVisible
            ? 'opacity-100 translate-x-0 lg:translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-x-full lg:translate-x-0 lg:translate-y-2 pointer-events-none'
        }
        bg-background border-primary border-t-2 shadow-lg transition-all duration-300 ease-in-out
        [.partial-editing-mode_&]:!static [.partial-editing-mode_&]:!opacity-100 [.partial-editing-mode_&]:!translate-0 [.partial-editing-mode_&]:!pointer-events-auto`}
    >
      {children}
    </div>
  );
};

interface MegaMenuBackButtonProps {
  menuId: string;
  children: ReactNode;
}

export const MegaMenuBackButton = ({ menuId, children }: MegaMenuBackButtonProps) => {
  const { setIsVisible } = useMegaMenu(menuId);

  return (
    <div
      className="lg:hidden flex gap-3 items-center text-sm font-semibold tracking-[0.08em] text-primary **:font-(family-name:--font-accent) uppercase cursor-pointer"
      onClick={() => setIsVisible(false)}
    >
      {children}
    </div>
  );
};
