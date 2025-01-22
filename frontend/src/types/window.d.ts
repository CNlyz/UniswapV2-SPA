export {};

type EthereumEventMap = {
  accountsChanged: string[];
  chainChanged: string;
  connect: { chainId: string };
  disconnect: { code: number; message: string };
};

declare global {
  interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: <T = unknown>(args: { method: string; params?: unknown[] }) => Promise<T>;
      on<K extends keyof EthereumEventMap>(
        event: K,
        callback: (payload: EthereumEventMap[K]) => void
      ): void;
      removeAllListeners<K extends keyof EthereumEventMap>(event: K): void;
      removeListener<K extends keyof EthereumEventMap>(
        event: K,
        callback: (payload: EthereumEventMap[K]) => void
      ): void;
    };
  }
} 