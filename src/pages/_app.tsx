import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { queryClient } from '../services/queryClient';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
            <SocketProvider>
              <Component {...pageProps} />
            </SocketProvider>
            </SidebarDrawerProvider>
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
    </AuthProvider>
  )
}

export default MyApp
