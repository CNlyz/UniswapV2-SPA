import { Box, Container, Heading, Button, Input, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';
import { Stack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACTS } from '../config/contracts';
import { useBalances } from '../hooks/useBalances';

export const Liquidity = () => {
  const { account, provider, isConnected } = useWallet();
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [usdcAmount, setUsdcAmount] = useState<string>('');
  const { tokenBalance, usdcBalance, lpBalance } = useBalances();
  const [lpToRemove, setLpToRemove] = useState<string>('');
  const toast = useToast();

  const handleAddLiquidity = async () => {
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
      
      // 授权 MTK
      const mockToken = new ethers.Contract(
        CONTRACTS.mockToken.address,
        CONTRACTS.mockToken.abi,
        signer
      );
      const tokenApprovalTx = await mockToken.approve(
        CONTRACTS.uniswapV2Pair.address,
        ethers.parseEther(tokenAmount)
      );
      await tokenApprovalTx.wait();

      // 授权 USDC
      const mockUSDC = new ethers.Contract(
        CONTRACTS.mockUSDC.address,
        CONTRACTS.mockUSDC.abi,
        signer
      );
      const usdcApprovalTx = await mockUSDC.approve(
        CONTRACTS.uniswapV2Pair.address,
        ethers.parseUnits(usdcAmount, 6)
      );
      await usdcApprovalTx.wait();

      // 添加流动性
      const pair = new ethers.Contract(
        CONTRACTS.uniswapV2Pair.address,
        CONTRACTS.uniswapV2Pair.abi,
        signer
      );

      const balance0 = await mockToken.balanceOf(CONTRACTS.uniswapV2Pair.address);
      const balance1 = await mockUSDC.balanceOf(CONTRACTS.uniswapV2Pair.address);
      console.log('@@@', balance0, balance1);

      const addLiquidityTx = await pair.mint(
        account
      );
      await addLiquidityTx.wait();

      toast({
        title: "成功",
        description: "已添加流动性",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // 清空输入
      setTokenAmount('');
      setUsdcAmount('');
    } catch (error) {
      console.error('添加流动性失败:', error);
      toast({
        title: "错误",
        description: "添加流动性失败",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveLiquidity = async () => {
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
      const pair = new ethers.Contract(
        CONTRACTS.uniswapV2Pair.address,
        CONTRACTS.uniswapV2Pair.abi,
        signer
      );

      // 授权 LP 代币
      const approveTx = await pair.approve(
        CONTRACTS.uniswapV2Pair.address,
        ethers.parseEther(lpToRemove)
      );
      await approveTx.wait();

      // 移除流动性
      const removeLiquidityTx = await pair.burn(
        account,
        ethers.parseEther(lpToRemove),
        0,
        0
      );
      await removeLiquidityTx.wait();

      toast({
        title: "成功",
        description: "已移除流动性",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // 清空输入
      setLpToRemove('');
    } catch (error) {
      console.error('移除流动性失败:', error);
      toast({
        title: "错误",
        description: "移除流动性失败",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        <Heading>流动性</Heading>
        
        {isConnected ? (
          <Box>
            <Text mb={4}>LP 代币余额: {lpBalance}</Text>
            
            <Tabs>
              <TabList>
                <Tab>添加流动性</Tab>
                <Tab>移除流动性</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
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
                      onClick={handleAddLiquidity}
                      disabled={!tokenAmount || !usdcAmount}
                    >
                      添加流动性
                    </Button>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack spacing={4}>
                    <Stack>
                      <Text>要移除的 LP 代币数量:</Text>
                      <Input
                        placeholder="输入 LP 代币数量"
                        value={lpToRemove}
                        onChange={(e) => setLpToRemove(e.target.value)}
                        type="number"
                      />
                    </Stack>

                    <Button
                      colorScheme="blue"
                      onClick={handleRemoveLiquidity}
                      disabled={!lpToRemove}
                    >
                      移除流动性
                    </Button>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
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