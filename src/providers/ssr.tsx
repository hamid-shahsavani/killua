import { createContext, useContext, ReactNode } from 'react';
import React from 'react';

const SSRKilluaContext = createContext<boolean>(false);

const SSRKilluaProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SSRKilluaContext.Provider value={true}>
      {children}
    </SSRKilluaContext.Provider>
  );
};

export default SSRKilluaProvider;

export const useSSRKillua = () => useContext(SSRKilluaContext);
