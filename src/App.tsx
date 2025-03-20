import * as React from 'react';
import { baseTheme } from './themes';
import { GlobalStyle } from './GlobalStyle';
import { Providers } from './Providers';
import { Routes, Route, Navigate } from 'react-router';
import { ActionModals } from './components/ActionModals';
import { EthBridge } from './pages/EthBridge';
import { Explorer } from './pages/Explorer';
import { Portfolio } from './pages/Portfolio';
import { MintTokens } from './pages/MintTokens';
import { Tokens } from './pages/Tokens';
import { IdentityTokens } from './pages/IdentityTokens';
import { InfoModal } from './components/InfoModal';
import { FAQPage } from './pages/FAQ';
import { InfoPage } from './pages/Info';
import { TransactionExample, Hrc20ContractExample } from './pages/Examples';
import { StuckOperations } from './pages/Explorer/StuckOperations';
import { AdminExplorer } from './pages/Explorer/AdminExplorer';
import { AdminExplorerFullHistory } from './pages/Explorer/AdminExplorerFullHistory';
import { HelpPage } from './interfaces/NeedHelp';
import { SupportPage } from './pages/Support';
import { ModalReactRouter } from './modals/ModalReactRouter';

const App: React.FC = () => (
  <Providers>
    <React.Suspense fallback={<div />}>
      <Routes>
        {process.env.VITE_GET_TOKENS_SERVICE === 'true' && (
          <Route path="/get-tokens" Component={MintTokens} />
        )}
        <Route path="/tokens" Component={Tokens} />
        <Route path="/itokens" Component={IdentityTokens} />
        <Route path="/tx-example" Component={TransactionExample} />
        <Route path="/hrc20-example" Component={Hrc20ContractExample} />
        <Route path="/faq" Component={FAQPage} />
        <Route path="/help" Component={HelpPage} />
        <Route path="/info" Component={InfoPage} />
        <Route path="/support" Component={SupportPage} />
        <Route path="/explorer/:validator?" Component={Explorer} />
        <Route path="/portfolio" Component={Portfolio} />
        <Route path="/stuck-operations" Component={StuckOperations} />
        <Route path="/admin-explorer" Component={AdminExplorer} />
        <Route path="/admin-explorer-full-history" Component={AdminExplorerFullHistory} />
        <Route path="/:token" Component={EthBridge} />
        <Route path="/:token/operations/:operationId" Component={EthBridge} />
        <Route path="*" element={<Navigate to="/one" />} />
      </Routes>
    </React.Suspense>
    <ActionModals />
    <ModalReactRouter />
    <InfoModal />
    <GlobalStyle theme={baseTheme} />
  </Providers>
);

export default App
