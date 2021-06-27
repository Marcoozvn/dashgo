import { Flex, Button, Stack } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from '../components/Form/Input';

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string()
    .required('E-mail obrigatório')
    .email('Insira um e-mail válido'),
  password: yup.string().required('Senha obrigatória')
})

export default function Home() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const handleSignIn: SubmitHandler<SignInFormData> = async (values, event) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(values)
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
          colorScheme='pink'
          size='lg'
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
      
    </Flex>
  )
}
