import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  Icon, 
  Text, 
  Table, 
  Thead, 
  Tr, 
  Th,
  Tbody,
  Td,
  useBreakpointValue,
  Spinner,
  Skeleton,
  Stack,
  Image,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Pagination } from '../../components/Pagination';
import React, { useState, useEffect } from 'react';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { useMutation } from 'react-query';
import { adminApi } from '../../services/adminApi';
import { queryClient } from '../../services/queryClient';
import { Purchase, PurchasesToProduct, usePurchases } from '../../services/hooks/usePurchases';
import { RiStopCircleLine, RiArrowRightCircleFill } from 'react-icons/ri';
import { useSocket } from '../../contexts/SocketContext';

export default function UserList() {
  const [page, setPage] = useState(1);
  const { socket } = useSocket();
  const { data, error, isLoading, isFetching } = usePurchases(page, {});

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true
  });

  function handleOnCalculateTotalForAPurchase(purchasesToProducts: Array<PurchasesToProduct>) {
    const total = purchasesToProducts.reduce((acc, purchaseToProducts) => {
      return acc + purchaseToProducts.product.price * purchaseToProducts.amount;
    }, 0);
    return total;
  }

  const cancelPurchase = useMutation(async (id: string) => {
    await adminApi.put(`purchasesAdmin/${id}`, {
      status: 'Cancelado'
    });
  }, {
    onSuccess: () => queryClient.invalidateQueries('purchasesAdmin'),
  });

  const advancePurchase = useMutation(async (data: {
    purchase: Purchase, status: string
  }) => {
    await adminApi.put(`purchasesAdmin/${data.purchase.id}`, {
      status: data.status,
    });
  }, {
    onSuccess: () => queryClient.invalidateQueries('purchasesAdmin'),
  });

  const handleOnCancelPurchase = async (purchase: Purchase) => {
    try {
      await cancelPurchase.mutateAsync(purchase.id);
      socket.emit('cancelPurchase', purchase);
    } catch(err) {
      alert('Erro ao cancelar o pedido');
    }
  }

  const handleOnUpdatePurchase = async (purchase: Purchase) => {
    try {
      const dictStatusOperation = {
        'Em análise': 'Em andamento',
        'Em andamento': 'À caminho',
        'À caminho': 'Finalizado',
      }
      const data = {
        purchase: purchase,
        status: dictStatusOperation[purchase.status]
      }
      await advancePurchase.mutateAsync(data);
      socket.emit('updatePurchase', data);
    } catch(err) {
      alert('Erro ao atualizar o pedido');
    }
  }

  useEffect((): any => {
    socket?.on('createPurchase', (purchase: Purchase) => {
      queryClient.invalidateQueries('purchasesAdmin');
      alert(`${purchase.user.name} realizou um pedido para ${new Date(purchase.expected_date).toLocaleDateString('pt-BR')}`);
    });
  }, [socket]);

  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />
        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Pedidos

              { !isLoading && isFetching && <Spinner size='sm' color='gray.500' ml='4'/> }
            
            </Heading>
          </Flex>
        
          { isLoading ? (
            <Stack >
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
            </Stack>
          ) : error ? (
            <Flex justify='center'>
              <Text>Falha ao obter dados dos pedidos</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme='whiteAlpha'>
                <Thead>
                  <Tr>
                    <Th>Cliente</Th>
                    <Th>Local de entrega</Th>
                    <Th>Data de entrega</Th>
                    <Th>Produtos</Th>
                    <Th>Total (R$)</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { data.purchases.map(purchase => (
                    <Tr key={purchase.id}>
                      <Td>
                        <Flex align='center'>
                          { isWideVersion && <Image src={purchase.user.avatar_url} boxSize='75px' borderRadius='full' alt={purchase.title}/>}
                        </Flex>
                      </Td>
                      <Td>
                        <Text width="10vw" textAlign="center">{purchase.location.address}</Text>
                      </Td>
                      <Td>
                        <Text>{new Date(purchase.expected_date).toLocaleDateString('pt-BR')}</Text>
                      </Td>
                      <Td>
                        {purchase.purchasesToProducts.map(purchaseToProduct => {
                          return (
                            <Flex align='center' key={purchaseToProduct.product.id}> 
                              <Image src={purchaseToProduct.product.image_url} boxSize='40px' borderRadius='full' alt={purchaseToProduct.product.title}/>
                              <Text paddingLeft="2">
                                {purchaseToProduct.amount}
                              </Text>
                            </Flex>
                          );
                        })}
                      </Td>
                      <Td>
                        <Text>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(handleOnCalculateTotalForAPurchase(purchase.purchasesToProducts))}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight='bold' color='green.400'>{purchase.status}</Text>
                      </Td>
                      <Td>
                        {(purchase.status !== 'Finalizado' && purchase.status !== 'Cancelado') && (
                          <Flex>
                            <IconButton aria-label="Delete" size='sm' colorScheme='red' icon={<RiStopCircleLine />} onClick={() => {handleOnCancelPurchase(purchase)}}/>
                            <IconButton marginLeft="2" aria-label="Delete" size='sm' colorScheme='green' icon={<RiArrowRightCircleFill />} onClick={() => {handleOnUpdatePurchase(purchase)}}/>
                          </Flex>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination 
                totalCountOfRegisters={data.totalCount} 
                currentPage={page} 
                onPageChange={setPage} />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});
