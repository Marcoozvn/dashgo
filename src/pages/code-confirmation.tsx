import { Flex, Button, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input } from '../components/Form/Input';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/apiClient';

type SendCodeFormData = {
  code: string;
}

type ValidateCodeResponse = {
  adminToken: string;
}

interface CodeConfirmationProps {
  token: string;
  refreshToken: string;
}

const sendCodeFormSchema = yup.object().shape({
  code: yup.string().required('Informe o código')
})

export default function CodeConfirmation({ token, refreshToken }: CodeConfirmationProps) {
  const { signIn } = useContext(AuthContext);

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    resolver: yupResolver(sendCodeFormSchema)
  });

  const handleSendCode: SubmitHandler<SendCodeFormData> = async (values, event) => {
    try {
      const { data: { adminToken } } = await api.post<ValidateCodeResponse>('/admin/validatecode', { token: values.code }, { headers: { Authorization: `Bearer ${token}` } } );
      signIn({ adminToken, token, refreshToken });
    } catch (error) {
      console.log(error);      
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
        onSubmit={handleSubmit(handleSendCode)}
      >
        <Stack spacing='4'>
          <Input 
            name='code' 
            label='Confirmação do código' 
            {...register('code')}
            error={errors.code} />
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
  );

}

export async function getServerSideProps(context) {
  return {
    props: {
      token: context.query.token,
      refreshToken: context.query.refreshToken
    }, 
  }
}