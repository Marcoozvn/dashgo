import { Box, Flex, Heading, Button, Icon, Text, Table, Thead, Tr, Th, Checkbox, Tbody, Td } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { RiAddLine } from 'react-icons/ri';
import React from 'react';
import { Pagination } from '../../components/Pagination';

export default function UserList() {
  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1400} mx='auto' px='6'>
        <Sidebar />
        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>Usuários</Heading>
            <Button
              as='a'
              size='sm'
              fontSize='sm'
              colorScheme='pink'
              leftIcon={<Icon as={RiAddLine} />}
            >
              Criar novo
            </Button>
          </Flex>
        
          <Table colorScheme='whiteAlpha'>
            <Thead>
              <Tr>
                <Th px='6' color='gray.300' width='8'>
                  <Checkbox colorScheme='pink' />
                </Th>
                <Th>Usuário</Th>
                <Th>Data de cadastro</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td px='6'>
                  <Checkbox colorScheme='pink' />
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight='bold'>Marcos Cesar</Text>
                    <Text fontSize='sm' color='gray.300'>marcos.cesar@sidia.com</Text>
                  </Box>
                </Td>
                <Td>04 de Abril, 2020</Td>
              </Tr>
            </Tbody>
          </Table>

          <Pagination />
        </Box>
      </Flex>
    </Box>
  )
}