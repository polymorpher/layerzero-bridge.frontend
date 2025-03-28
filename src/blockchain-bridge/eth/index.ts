import { EthMethods } from './EthMethods';
import { EthMethodsERC20 } from './EthMethodsERC20';
import { EthMethodsHRC20 } from './EthMethodsHRC20';
import { NETWORK_TYPE, TConfig, TFullConfig } from '../../stores/interfaces';
import stores from '../../stores';
import { getNetworkFee } from './helpers';
import Web3 from 'web3';
import { EthMethodsHRC721 } from './EthMethodsHRC721';
import { EthMethodsHRC1155 } from './EthMethodsHRC1155';
import { EthMethodsERC1155 } from './EthMethodsERC1155';
import { networks } from '../../configs';
import * as ERC20Json from '../out/MyERC20';
import * as LINKEthManagerJson from '../out/LINKEthManager';
import * as ethManagerErc20Json from '../out/EthManagerERC20';
import * as ethManagerHrc20Json from '../out/EthManagerHRC20';
import * as ethManagerERC721Json from '../out/ERC721EthManager';
import * as ethManagerHRC721Json from '../out/NFTEthManager';
import * as ethManagerHRC1155Json from '../out/HRC1155EthManager';
import * as ethManagerERC1155Json from '../out/ERC1155EthManager';

// @ts-ignore
const web3URL = window.ethereum ? window.ethereum : import.meta.env.VITE_ETH_NODE_URL;

export interface INetworkMethods {
  web3: Web3;
  ethMethodsBUSD: EthMethods;
  ethMethodsLINK: EthMethods;
  ethMethodsERC20: EthMethodsERC20;
  ethMethodsHRC20: EthMethodsHRC20;
  ethMethodsERС721: EthMethodsERC20;
  ethMethodsHRC721: EthMethodsHRC721;
  ethMethodsERC1155: EthMethodsERC1155;
  ethMethodsHRC1155: EthMethodsHRC1155;
  getNetworkFee: () => Promise<number>;
  getEthBalance: (address: string) => Promise<string>;
}

export const initNetwork = (config: TConfig, url?: string): INetworkMethods => {
  const web3 = new Web3(url || web3URL);

  const ethBUSDContract = new web3.eth.Contract(
    ERC20Json.abi,
    config.contracts.busd,
  );

  const ethBUSDManagerContract = new web3.eth.Contract(
    LINKEthManagerJson.abi,
    config.contracts.busdManager,
  );

  const ethLINKContract = new web3.eth.Contract(
    ERC20Json.abi,
    config.contracts.link,
  );

  const ethLINKManagerContract = new web3.eth.Contract(
    LINKEthManagerJson.abi,
    config.contracts.linkManager,
  );

  const ethMethodsBUSD = new EthMethods({
    web3: web3,
    ethTokenContract: ethBUSDContract,
    ethManagerContract: ethBUSDManagerContract,
    ethManagerAddress: config.contracts.busdManager,
  });

  const ethMethodsLINK = new EthMethods({
    web3: web3,
    ethTokenContract: ethLINKContract,
    ethManagerContract: ethLINKManagerContract,
    ethManagerAddress: config.contracts.linkManager,
  });

  const ethManagerContract = new web3.eth.Contract(
    ethManagerErc20Json.abi,
    config.contracts.erc20Manager,
  );

  const ethManagerContractHrc20 = new web3.eth.Contract(
    ethManagerHrc20Json.abi,
    config.contracts.hrc20Manager,
  );

  const ethManagerContractERC721 = new web3.eth.Contract(
    ethManagerERC721Json.abi,
    config.contracts.erc721Manager,
  );

  const ethManagerContractHRC721 = new web3.eth.Contract(
    ethManagerHRC721Json.abi,
    config.contracts.hrc721Manager,
  );

  const ethManagerContractHRC1155 = new web3.eth.Contract(
    ethManagerHRC1155Json.abi,
    config.contracts.hrc1155Manager,
  );

  const ethManagerContractERC1155 = new web3.eth.Contract(
    ethManagerERC1155Json.abi,
    config.contracts.erc1155Manager,
  );

  const ethMethodsERC20 = new EthMethodsERC20({
    web3: web3,
    ethManagerContract: ethManagerContract,
    ethManagerAddress: config.contracts.erc20Manager,
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit
  });

  const ethMethodsHRC20 = new EthMethodsHRC20({
    web3: web3,
    ethManagerContract: ethManagerContractHrc20,
    ethManagerAddress: config.contracts.hrc20Manager,
    ethTokenManagerAddress: config.contracts.tokenManager,
    gasPrice: config.gasPrice,
  });

  const ethMethodsERС721 = new EthMethodsERC20({
    web3: web3,
    ethManagerContract: ethManagerContractERC721,
    ethManagerAddress: config.contracts.erc721Manager,
  });

  const ethMethodsHRC721 = new EthMethodsHRC721({
    web3: web3,
    ethManagerContract: ethManagerContractHRC721,
    ethManagerAddress: config.contracts.hrc721Manager,
    ethTokenManagerAddress: config.contracts.hrc721TokenManager,
    gasPrice: config.gasPrice,
  });

  const ethMethodsERC1155 = new EthMethodsERC1155({
    web3: web3,
    ethManagerContract: ethManagerContractERC1155,
    ethManagerAddress: config.contracts.erc1155Manager,
  });

  const ethMethodsHRC1155 = new EthMethodsHRC1155({
    web3: web3,
    ethManagerContract: ethManagerContractHRC1155,
    ethManagerAddress: config.contracts.hrc1155Manager,
    ethTokenManagerAddress: config.contracts.hrc1155TokenManager,
    gasPrice: config.gasPrice,
  });

  return {
    web3,
    ethMethodsBUSD,
    ethMethodsLINK,
    ethMethodsERC20,
    ethMethodsHRC20,
    ethMethodsERС721,
    ethMethodsHRC721,
    ethMethodsERC1155,
    ethMethodsHRC1155,
    getNetworkFee: () => getNetworkFee(web3),
    getEthBalance: (ethAddress): Promise<string> => {
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(ethAddress, (err, balance) => {
          if (err) {
            reject(err);
          }
          // const rez = String(new BN(balance).div(new BN(1e18)));

          resolve(String(Number(balance) / 1e18));
        });
      });
    },
  };
};

let networksMethods
  : Array<{
    type: Exclude<NETWORK_TYPE, NETWORK_TYPE.HARMONY>,
    methods: INetworkMethods
  }> = [];

export const initNetworks = (fullCinfig: TFullConfig) => {
  networksMethods = Object.keys(fullCinfig)
    .filter(key => key !== NETWORK_TYPE.HARMONY && networks[key])
    .map((key: Exclude<NETWORK_TYPE, NETWORK_TYPE.HARMONY>) => {
      let config = fullCinfig[key];

      if (key === NETWORK_TYPE.ARBITRUM) {
        config = {
          ...fullCinfig[key],
          gasLimit: 2000000,
          gasPrice: 100000000
        }
      }

      return {
        type: key,
        methods: initNetwork(config)
      }
    })
};

export const getExNetworkMethods = (
  network?: NETWORK_TYPE,
): INetworkMethods | undefined => {
  const net: NETWORK_TYPE = network || stores.exchange.network;

  const methodsConfig = networksMethods.find(nm => nm.type === net)

  if(methodsConfig) {
    return methodsConfig.methods
  }

  return undefined

  // throw new Error(`network ${stores.exchange.network}`);
};
