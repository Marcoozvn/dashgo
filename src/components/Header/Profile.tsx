import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align='center'>
      { showProfileData && (
        <Box mr='4' textAlign='right'>
        <Text>Marcos Cesar</Text>
        <Text color='gray.300' fontSize='small'>
          marcos.cesar@sidia.com
        </Text>
      </Box>
      )}
      <Avatar size='md' name='Marcos Cesar' src='https://avatars.githubusercontent.com/u/11970313?v=4' />
    </Flex>
  )
}