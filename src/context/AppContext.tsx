

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppMode = 'menu' | 'marketplace' | 'travel';

interface AppContextType {
  appMode: AppMode | null;
  setAppMode: (mode: AppMode | null) => void;
  homePageResetKey: number;
  resetHomePage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [homePageResetKey, setHomePageResetKey] = useState(0);
  
  const resetHomePage = () => setHomePageResetKey(prev => prev + 1);

  return (
    <AppContext.Provider value={{ appMode, setAppMode, homePageResetKey, resetHomePage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
