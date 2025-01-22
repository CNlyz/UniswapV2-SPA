import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export interface WalletState {
  account: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  isConnected: boolean;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: '',
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false,
  });

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const chainId = Number(await window.ethereum.request({ method: 'eth_chainId' }));
        
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            setState({
              account: accounts[0].address,
              provider,
              signer,
              chainId,
              isConnected: true,
            });
          }
        } catch (error) {
          console.error('Failed to get accounts:', error);
        }

        // 监听账户变化
        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            setState(prev => ({
              ...prev,
              account: accounts[0],
              signer,
              isConnected: true,
            }));
          } else {
            setState(prev => ({
              ...prev,
              account: '',
              signer: null,
              isConnected: false,
            }));
          }
        });

        // 监听链变化
        window.ethereum.on('chainChanged', (chainId: string) => {
          setState(prev => ({
            ...prev,
            chainId: Number(chainId),
          }));
        });
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await provider.listAccounts();
    const signer = await provider.getSigner();
    const chainId = Number(await window.ethereum.request({ method: 'eth_chainId' }));

    setState({
      account: accounts[0].address,
      provider,
      signer,
      chainId,
      isConnected: true,
    });
  };

  const disconnect = () => {
    setState({
      account: '',
      provider: null,
      signer: null,
      chainId: null,
      isConnected: false,
    });
  };

  return {
    ...state,
    connect,
    disconnect,
  };
}; 