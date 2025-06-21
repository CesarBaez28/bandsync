'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

type SideNavContextType = {
  isCollapsed: boolean;
  toggleSideNav: () => void;
  setCollapsed: (value: boolean) => void;
  mounted: boolean;
};

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

export const SideNavProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const toggleSideNav = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const mobile = window.innerWidth <= 768;
    setIsCollapsed(mobile);
    setMounted(true);
  }, []);

  const value = useMemo(
    () => ({
      isCollapsed,
      toggleSideNav,
      setCollapsed: setIsCollapsed,
      mounted
    }),
    [isCollapsed, mounted]
  );

  return (
    <SideNavContext.Provider value={value}>
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = () => {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error('useSideNav must be used within SideNavProvider');
  }
  return context;
};
