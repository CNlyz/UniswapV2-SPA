import { Heading, Text, Box, Container } from '@chakra-ui/react';
import { Stack, HStack } from '@chakra-ui/layout';
import { WalletConnect } from '../components/WalletConnect';
import { useWallet } from '../hooks/useWallet';
import { useBalances } from '../hooks/useBalances';

export const Home = () => {
  const { isConnected } = useWallet();
  const { tokenBalance, usdcBalance } = useBalances();

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={8}>
        <Heading>UniswapV2 Demo</Heading>
        <WalletConnect />
        
        {isConnected && (
          <Box borderWidth={1} borderRadius="lg" p={6} width="full">
            <Stack spacing={4}>
              <Heading size="md">代币余额</Heading>
              <HStack justify="space-between" width="full">
                <Text>MockERC20:</Text>
                <Text>{tokenBalance}</Text>
              </HStack>
              <HStack justify="space-between" width="full">
                <Text>MOCK_USDC:</Text>
                <Text>{usdcBalance}</Text>
              </HStack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}; 