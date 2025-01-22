import { Box, Container } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';

export const Navigation = () => {
  return (
    <Box bg="gray.100" py={4}>
      <Container maxW="container.md">
        <HStack spacing={8}>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/trade">交易</RouterLink>
          <RouterLink to="/liquidity">流动性</RouterLink>
          <RouterLink to="/history">历史记录</RouterLink>
        </HStack>
      </Container>
    </Box>
  );
}; 