import { ReactNode, useState, createContext, useEffect } from 'react';
import { api } from '../services/apiClient';
import { adminApi } from '../services/adminApi';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import jwt from 'jwt-decode';

type User = {
  name: string;
  avatar_url: string;
  email: string;
}

type AuthParams = {
  adminToken: string;
  token: string;
  refreshToken: string;  
}

type AuthContextData = {
  signIn(params: AuthParams): Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User | undefined;
  authToken: string | null;
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const [authToken, setAuthToken] = useState(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      const user = jwt<User>(token);
      setUser({ ...user });
      setAuthToken(token);
    }
  }, []);

  function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.token');
    setUser(null);
    setAuthToken(null);
  }

  async function signIn({ adminToken, token, refreshToken }: AuthParams) {
    try {

      setCookie(undefined, 'nextauth.adminToken', adminToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
      
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      const user = jwt<User>(token);

      setUser({ ...user });
      setAuthToken(token);

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      adminApi.defaults.headers['Authorization'] = `Bearer ${adminToken}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user, authToken }}>
      {children}
    </AuthContext.Provider>
  )
  
}