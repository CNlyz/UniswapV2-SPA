import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACTS } from '../config/contracts';
import { useToast } from '@chakra-ui/toast';

export const useBalances = () => {
  const { account, provider, isConnected } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [lpBalance, setLpBalance] = useState<string>('0');
  const toast = useToast();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isConnected || !provider || !account) return;

      try {
        const signer = await provider.getSigner();
        
        // 获取 MTK 余额
        const mockToken = new ethers.Contract(
          CONTRACTS.mockToken.address,
          CONTRACTS.mockToken.abi,
          signer
        );
        const mtkBalance = await mockToken.balanceOf(account);
        setTokenBalance(ethers.formatEther(mtkBalance));

        // 获取 USDC 余额
        const mockUSDC = new ethers.Contract(
          CONTRACTS.mockUSDC.address,
          CONTRACTS.mockUSDC.abi,
          signer
        );
        const usdcBalance = await mockUSDC.balanceOf(account);
        setUsdcBalance(ethers.formatUnits(usdcBalance, 6));

        // 获取 LP 代币余额
        const pair = new ethers.Contract(
          CONTRACTS.uniswapV2Pair.address,
          CONTRACTS.uniswapV2Pair.abi,
          signer
        );
        const lpBalance = await pair.balanceOf(account);
        setLpBalance(ethers.formatEther(lpBalance));
      } catch (error) {
        console.error('获取余额失败:', error);
        toast({
          title: "错误",
          description: "获取代币余额失败",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [account, provider, isConnected, toast]);

  return { tokenBalance, usdcBalance, lpBalance };
}; 