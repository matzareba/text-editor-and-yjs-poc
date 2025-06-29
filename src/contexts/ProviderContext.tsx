import React, { createContext, useContext, ReactNode } from 'react';
import YProvider from 'y-partyserver/provider';

interface ProviderContextType {
  provider: YProvider;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const useProvider = (): YProvider => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within a YProviderWrapper');
  }
  return context.provider;
};

interface YProviderProps {
  provider: YProvider;
  children: ReactNode;
}

export const YProviderWrapper: React.FC<YProviderProps> = ({ provider, children }) => {
  return (
    <ProviderContext.Provider value={{ provider }}>
      {children}
    </ProviderContext.Provider>
  );
};