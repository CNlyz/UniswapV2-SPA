import { Box, Container, Heading, Text, Badge } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/layout';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/table';
import { useToast } from '@chakra-ui/toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACTS } from '../config/contracts';

interface Event {
  type: 'swap' | 'mint' | 'burn';
  transactionHash: string;
  timestamp: number;
  data: {
    amount0?: string;
    amount1?: string;
    sender?: string;
    to?: string;
  };
}

export const History = () => {
  const { account, provider, isConnected } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isConnected || !provider || !account) return;
      setIsLoading(true);

      try {
        const pair = new ethers.Contract(
          CONTRACTS.uniswapV2Pair.address,
          CONTRACTS.uniswapV2Pair.abi,
          provider
        );

        // 获取最近的区块
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 10000); // 最多查询10000个区块

        // 获取所有相关事件
        const [swaps, mints, burns] = await Promise.all([
          pair.queryFilter(pair.filters.Swap(), fromBlock),
          pair.queryFilter(pair.filters.Mint(), fromBlock),
          pair.queryFilter(pair.filters.Burn(), fromBlock)
        ]);

        // 处理事件数据
        const allEvents: Event[] = [
          ...swaps.map(event => ({
            type: 'swap' as const,
            transactionHash: event.transactionHash,
            timestamp: 0, // 稍后更新
            data: {
              amount0: ethers.formatEther(event.args?.[2] || 0),
              amount1: ethers.formatUnits(event.args?.[3] || 0, 6),
              sender: event.args?.[0],
              to: event.args?.[1]
            }
          })),
          ...mints.map(event => ({
            type: 'mint' as const,
            transactionHash: event.transactionHash,
            timestamp: 0,
            data: {
              amount0: ethers.formatEther(event.args?.[1] || 0),
              amount1: ethers.formatUnits(event.args?.[2] || 0, 6),
              sender: event.args?.[0]
            }
          })),
          ...burns.map(event => ({
            type: 'burn' as const,
            transactionHash: event.transactionHash,
            timestamp: 0,
            data: {
              amount0: ethers.formatEther(event.args?.[1] || 0),
              amount1: ethers.formatUnits(event.args?.[2] || 0, 6),
              sender: event.args?.[0]
            }
          }))
        ];

        // 获取每个事件的时间戳
        const eventsWithTimestamp = await Promise.all(
          allEvents.map(async (event) => {
            const block = await provider.getBlock(event.transactionHash);
            return {
              ...event,
              timestamp: block?.timestamp || 0
            };
          })
        );

        // 按时间戳排序
        const sortedEvents = eventsWithTimestamp.sort((a, b) => b.timestamp - a.timestamp);
        setEvents(sortedEvents);
      } catch (error) {
        console.error('获取历史记录失败:', error);
        toast({
          title: "错误",
          description: "获取历史记录失败",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [account, provider, isConnected, toast]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getEventBadgeColor = (type: Event['type']) => {
    switch (type) {
      case 'swap':
        return 'blue';
      case 'mint':
        return 'green';
      case 'burn':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Stack spacing={8}>
        <Heading>历史记录</Heading>
        
        {isConnected ? (
          <Box overflowX="auto">
            {isLoading ? (
              <Text>加载中...</Text>
            ) : events.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>时间</Th>
                    <Th>类型</Th>
                    <Th>发送方</Th>
                    <Th>接收方</Th>
                    <Th>MTK 数量</Th>
                    <Th>USDC 数量</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {events.map((event, index) => (
                    <Tr key={event.transactionHash + index}>
                      <Td>{formatTimestamp(event.timestamp)}</Td>
                      <Td>
                        <Badge colorScheme={getEventBadgeColor(event.type)}>
                          {event.type === 'swap' ? '交换' :
                           event.type === 'mint' ? '添加流动性' : '移除流动性'}
                        </Badge>
                      </Td>
                      <Td>{formatAddress(event.data.sender || '')}</Td>
                      <Td>{event.data.to ? formatAddress(event.data.to) : '-'}</Td>
                      <Td>{event.data.amount0}</Td>
                      <Td>{event.data.amount1}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>暂无历史记录</Text>
            )}
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