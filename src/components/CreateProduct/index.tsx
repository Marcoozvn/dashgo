import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react';
import React from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import router from 'next/router';
import { useMutation } from 'react-query';

import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Input } from '../../components/Form/Input';
import { adminApi } from '../../services/adminApi';
import { queryClient } from '../../services/queryClient';
import { TextAreaInput } from '../../components/Form/TextAreaInput';
import { ImageInput } from '../../components/Form/ImageInput';
import { useState } from 'react';

interface CreateProductProps {
  editingProduct?: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
  }
}

type CreateProductFormData = {
  id?: string;
  title: string;
  description: string;
  price: number;
  image: File 
  image_url?: string;
}

const createProductSchema = yup.object().shape({
  title: yup.string().required('Título obrigatório'),
  price: yup.number().required('Preço obrigatório').min(0.1, 'Insira um preço válido').typeError('Insira um preço válido'),
  description: yup.string().required('Descrição obrigatória')
})

export function CreateProduct({ editingProduct }: CreateProductProps) {
  const [image, setImage] = useState<File>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: editingProduct ?? null,
    resolver: yupResolver(createProductSchema)
  });

  const createProduct = useMutation(async (product: CreateProductFormData) => {
    const data = new FormData();

    if (editingProduct?.id) {
      data.append('id', product.id);
    }

    data.append('title', product.title);
    data.append('description', product.description);
    data.append('price', String(product.price));

    if (image) {
      data.append('image', image);
    } 

    if (editingProduct) {
      data.append('image_url', editingProduct.image_url);
    }

    const response = await adminApi.post('products', data);

    return response.data.product;
  }, {
    onSuccess: () => queryClient.invalidateQueries('products')
  });

  const handleCreateProduct: SubmitHandler<CreateProductFormData> = async (values) => {
    await createProduct.mutateAsync(values);
    router.push('/products');
  }

  function handleSelectImage(file: File) {
    setImage(file);
  }

  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />

        <Box
          as='form'
          flex='1'
          borderRadius={8}
          bg='gray.800'
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateProduct)}>
          <Heading size='lg' fontWeight='normal'>Criar produto</Heading>

          <Divider my='6' borderColor='gray.700'/>

          <VStack spacing='8'>
            <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
              <ImageInput error={false} onFileUploaded={handleSelectImage} initialImage={editingProduct ? editingProduct.image_url : null} />
              
            </SimpleGrid>
            <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
              <Input
                name='title'
                label='Nome do produto' 
                {...register('title')}
                error={errors.title}
              />

              <Input 
                name='price' 
                type='numeric' 
                label='Preço do produto (em R$)'
                {...register('price')}
                error={errors.price} 
              />
            </SimpleGrid>
            
            <SimpleGrid minChildWidth='240px' spacing={['6', '8']} w='100%'>
              <TextAreaInput
                name='description'
                label='Descrição do produto' 
                {...register('description')} 
                error={errors.description}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt='8' justify='flex-end'>
            <HStack spacing='4'>
              <Link href='/products' passHref>
                <Button colorScheme='whiteAlpha'>Cancelar</Button>
              </Link>
              <Button type='submit' colorScheme='green' isLoading={isSubmitting}>
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
