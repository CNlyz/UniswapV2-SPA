import { Button, Text } from '@chakra-ui/react';
import { Stack, HStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletConnect = () => {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });

      // 监听链变化
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      toast({
        title: "错误",
        description: "请安装 MetaMask",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      toast({
        title: "连接成功",
        description: "钱包已连接",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('连接钱包失败:', error);
      toast({
        title: "连接失败",
        description: "连接钱包时发生错误",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={4}>
      {!account ? (
        <Button colorScheme="blue" onClick={connectWallet}>
          连接钱包
        </Button>
      ) : (
        <HStack>
          <Text>当前钱包地址:</Text>
          <Text fontWeight="bold">
            {account.slice(0, 6)}...{account.slice(-4)}
          </Text>
        </HStack>
      )}
    </Stack>
  );
}; 