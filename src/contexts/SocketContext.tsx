import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

interface SocketProps {
  socket: Socket | undefined;
}

const SocketContext = createContext<SocketProps>({} as SocketProps);

const SocketProvider: React.FC = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (authToken) {
      const currentSocket = io('http://localhost:3333', {
        query: { token: authToken },
      });
      setSocket(currentSocket);
    } else {
      setSocket(undefined);
    }
  }, [authToken]);

  useEffect((): any => {
    return () => socket?.disconnect();
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = (): SocketProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
};

export { SocketProvider, useSocket };
