import * as React from 'react';
import stores, { StoresProvider } from './stores';
import { Router } from 'react-router';
import { Provider as MobxProvider } from 'mobx-react';
import { ThemeProvider } from './themes/ThemeProvider';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => (
  <StoresProvider stores={stores}>
    <MobxProvider {...stores}>
      <ThemeProvider>
        <Router location={stores.routing.location} navigator={stores.routing.history}>
          {children}
        </Router>
      </ThemeProvider>
    </MobxProvider>
  </StoresProvider>
);
