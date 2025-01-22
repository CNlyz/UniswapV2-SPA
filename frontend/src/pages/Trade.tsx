import { Box, Container, Heading, Button, Input, Text } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACTS } from '../config/contracts';
import { useBalances } from '../hooks/useBalances';

export const Trade = () => {
  const { account, provider, isConnected } = useWallet();
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [usdcAmount, setUsdcAmount] = useState<string>('');
  const { tokenBalance, usdcBalance } = useBalances();
  const toast = useToast();

  const handleSwap = async () => {
    if (!isConnected || !provider || !account) {
      toast({
        title: "错误",
        description: "请先连接钱包",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const signer = await provider.getSigner();
      const uniswapPair = new ethers.Contract(
        CONTRACTS.uniswapV2Pair.address,
        CONTRACTS.uniswapV2Pair.abi,
        signer
      );

      // 检查储备量
      const reserve0 = await uniswapPair.reserve0();
      const reserve1 = await uniswapPair.reserve1();
      console.log('Reserves:', {
        reserve0: reserve0.toString(),
        reserve1: reserve1.toString()
      });

      // 检查输入输出金额
      const amountIn = ethers.parseUnits(tokenAmount.toString(), 18);
      const amountOut = ethers.parseUnits(usdcAmount.toString(), 18);
      console.log('Amounts:', {
        amountIn: amountIn.toString(),
        amountOut: amountOut.toString()
      });

      // 检查代币授权
      const mockToken = new ethers.Contract(
        CONTRACTS.mockToken.address,
        CONTRACTS.mockToken.abi,
        signer
      );
      const allowance = await mockToken.allowance(account, CONTRACTS.uniswapV2Pair.address);
      console.log('Allowance:', allowance.toString());

    //   if (allowance < amountIn) {
    //     const approveTx = await mockToken.approve(
    //       CONTRACTS.uniswapV2Pair.address,
    //       ethers.MaxUint256
    //     );
    //     await approveTx.wait();
    //     console.log('Approved');
    //   }

      // 执行交换
      const tx = await uniswapPair.swap(
        amountIn,
        amountOut,
        account
      );
      await tx.wait();
      toast({
        title: "交易成功",
        status: "success",
      });

      // 刷新余额
      setTokenAmount('');
      setUsdcAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      toast({
        title: "交易失败",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        <Heading>交易</Heading>
        
        {isConnected ? (
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <Stack spacing={4}>
              <Stack>
                <Text>MockERC20 余额: {tokenBalance}</Text>
                <Input
                  placeholder="输入 MockERC20 数量"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  type="number"
                />
              </Stack>

              <Stack>
                <Text>MOCK_USDC 余额: {usdcBalance}</Text>
                <Input
                  placeholder="输入 MOCK_USDC 数量"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                  type="number"
                />
              </Stack>

              <Button 
                colorScheme="blue" 
                onClick={handleSwap}
                disabled={!tokenAmount || !usdcAmount}
              >
                交换
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box textAlign="center" p={6}>
            <Text>请先连接钱包</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}; 