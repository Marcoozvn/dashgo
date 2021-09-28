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
  Checkbox,
  Tbody,
  Td,
  useBreakpointValue,
  Spinner,
  Skeleton,
  Stack,
  Link,
  Image,
  IconButton
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { RiAddLine, RiDeleteBin6Fill } from 'react-icons/ri';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Pagination } from '../../components/Pagination';
import { useProducts } from '../../services/hooks/useProducts';
import { useState } from 'react';
import { withSSRAuth } from '../../utils/withSSRAuth';
import { useMutation } from 'react-query';
import { adminApi } from '../../services/adminApi';
import { queryClient } from '../../services/queryClient';

export default function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useProducts(page, {});

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true
  });

  const createProduct = useMutation(async (id: string) => {
    await adminApi.delete(`products/${id}`);
  }, {
    onSuccess: () => queryClient.invalidateQueries('products')
  });

  const handleDeleteProduct = async (id: string) => {
    await createProduct.mutateAsync(id);
  }

  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />
        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Produtos

              { !isLoading && isFetching && <Spinner size='sm' color='gray.500' ml='4'/> }
            
            </Heading>
            <NextLink href='/products/create' passHref>
              <Button
                as='a'
                size='sm'
                fontSize='sm'
                colorScheme='green'
                leftIcon={<Icon as={RiAddLine} />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>
        
          { isLoading ? (
            <Stack >
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
              <Skeleton height='40px' width='100%' startColor='gray.800' endColor='gray.900'/>
            </Stack>
          ) : error ? (
            <Flex justify='center'>
              <Text>Falha ao obter dados dos usuários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme='whiteAlpha'>
                <Thead>
                  <Tr>
                    
                    <Th>Produto</Th>
                    <Th>Preço (R$)</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { data.products.map(product => (
                    <Tr key={product.id}>
                      <Td>
                        <Flex align='center'>
                          { isWideVersion && <Image src={product.image_url} boxSize='100px' borderRadius='full' alt={product.title}/>}
                          <Box ml={isWideVersion ? '8': '0'}>
                            <Link color='green.400' href={`products/update/${product.id}`}>
                              <Text fontWeight='bold'>{product.title}</Text>
                            </Link>
                            <Text fontSize='sm' color='gray.300'>{product.description}</Text>
                          </Box>
                        </Flex>
                      </Td>
                      <Td>
                        <Text>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</Text>
                      </Td>
                      <Td>
                        <IconButton aria-label="Delete" size='sm' colorScheme='red' icon={<RiDeleteBin6Fill />} onClick={() => handleDeleteProduct(product.id)}/>
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

/*
export const getServerSideProps: GetServerSideProps = async () => {
  const { products, totalCount } = await getUsers(1);

  return {
    props: {
      users,
    }
  }
}
*/

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});
