import * as React from 'react';
import { useEffect } from 'react';
import { Box } from 'grommet';

import { observer } from 'mobx-react-lite';
import { useStores } from '@/stores';
import { TOKEN } from '@/stores/interfaces';
import { LayoutCommon } from '../../components/Layouts/LayoutCommon/LayoutCommon';
import { ethBridgeStore } from './EthBridgeStore';
import { StepManager } from './components/StepManager/StepManager';
import { Form } from '../../components/Form';
import { useParams } from 'react-router';

export const EthBridge = observer((props: any) => {
  const {
    user,
    exchange,
    routing,
    userMetamask,
    tokens,
    erc20Select,
  } = useStores();

  const params = useParams()

  useEffect(() => {
    tokens.init();
    tokens.fetch();
  }, []);

  useEffect(() => {
    if (!params.token) {
      return;
    }

    const tokenTypeFromUrl = params.token;

    const token = exchange.getDefaultToken();

    if (
      ![TOKEN.ERC20, TOKEN.ETH, TOKEN.ONE, TOKEN.ERC721].includes(
        tokenTypeFromUrl,
      )
    ) {
      routing.push(TOKEN.ONE);
      erc20Select.setToken(token.erc20Address);
      return;
    }

    exchange.setToken(tokenTypeFromUrl);
    erc20Select.setToken(token.erc20Address);

    if (TOKEN.ETH === tokenTypeFromUrl) {
      user.setHRC20Token(import.meta.env.VITE_ETH_HRC20);
      userMetamask.setTokenDetails({
        name: 'ETH',
        decimals: '18',
        erc20Address: '',
        symbol: 'ETH',
      });
    }

    if (params.operationId) {
      exchange.setOperationId(params.operationId);
      exchange.sendOperation(params.operationId);
    }
  }, []);

  return (
    <LayoutCommon>
      <Box
        direction="column"
        wrap={true}
        fill={true}
        justify="center"
        align="center"
        style={{ maxWidth: '580px' }}
      >
        <Form
          style={{ width: 'inherit' }}
          ref={ref => (ethBridgeStore.formRef = ref)}
          data={exchange.transaction}
        >
          <StepManager />
        </Form>
      </Box>
    </LayoutCommon>
  );
});
