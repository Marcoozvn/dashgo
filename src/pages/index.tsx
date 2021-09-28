import { Flex, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from '../components/Form/Input';
import { api } from '../services/apiClient';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
}

type SignInResponse = {
  user: any;
  token: string;
  refreshToken: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string()
    .required('E-mail obrigatório')
    .email('Insira um e-mail válido'),
  password: yup.string().required('Senha obrigatória')
})

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const toast = useToast();

  const handleSignIn: SubmitHandler<SignInFormData> = async (values, event) => {
    const { email, password } = values;
    
    try {
      const response = await api.post<SignInResponse>('/sessions', { email, password });
      await api.post('/admin/sendCode', { email }, { headers: { Authorization: `Bearer ${response.data.token}` } });
      Router.push({
        pathname: 'code-confirmation',
        query: {
          token: response.data.token,
          refreshToken: response.data.refreshToken
        }
      });
    } catch (err) {
      toast({
        title: 'Login/senha inválidos',
        description: 'Por favor, insira novamente suas credenciais.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  return (
    <Flex
      w='100vw'
      h='100vh'
      align='center'
      justify='center'
    >
      <Flex
        as='form'
        width='100%'
        maxWidth={360}
        bg='gray.800'  
        p='8'
        borderRadius={8}
        flexDir='column'
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing='4'>
          <Input 
            name='email' 
            label='Email' 
            {...register('email')}
            error={errors.email} />

          <Input 
            name='password' 
            label='Senha' 
            {...register('password')}
            error={errors.password} />
        </Stack>

        <Button
          type='submit'
          mt='6'
          colorScheme='green'
          size='lg'
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
      
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});
