import MockERC20ABI from './abi/MockERC20.json';
import UniswapV2PairABI from './abi/UniswapV2Pair.json';

// 定义 ABI 类型
type AbiFunction = {
  inputs: { name: string; type: string; }[];
  name: string;
  outputs: { name: string; type: string; }[];
  stateMutability: string;
  type: string;
};

type AbiEvent = {
  anonymous: boolean;
  inputs: { indexed: boolean; name: string; type: string; }[];
  name: string;
  type: 'event';
};

type ContractAbi = (AbiFunction | AbiEvent)[];

interface ContractConfig {
  address: string;
  abi: ContractAbi;
}

interface ContractsConfig {
  mockToken: ContractConfig;
  mockUSDC: ContractConfig;
  uniswapV2Pair: ContractConfig;
}

export const CONTRACTS: ContractsConfig = {
  mockToken: {
    address: import.meta.env.VITE_MOCK_TOKEN_ADDRESS || '',
    abi: MockERC20ABI.abi as ContractAbi,
  },
  mockUSDC: {
    address: import.meta.env.VITE_MOCK_USDC_ADDRESS || '',
    abi: MockERC20ABI.abi as ContractAbi,
  },
  uniswapV2Pair: {
    address: import.meta.env.VITE_UNISWAP_V2_PAIR_ADDRESS || '',
    abi: UniswapV2PairABI.abi as ContractAbi,
  },
}; 