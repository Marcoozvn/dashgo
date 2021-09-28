import { Flex, Box, Text, Avatar, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push('/');
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Flex align='center'>
          { showProfileData && (
            <Box mr='4' textAlign='right'>
            <Text>{user?.name}</Text>
            <Text color='gray.300' fontSize='small'>
              {user?.email}
            </Text>
          </Box>
          )}
          <Avatar size='md' name={user?.name} src={user?.avatar_url} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent bg='gray.800' w={['100px', '200px']}>
        <Flex align='center' justify='space-around' p='2' onClick={handleSignOut}>
          <Text>Sair</Text>
          <FiLogOut />
        </Flex>
      </PopoverContent>
    </Popover>
  )
}