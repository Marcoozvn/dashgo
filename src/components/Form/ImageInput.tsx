/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { Image, Flex, Input, Text } from '@chakra-ui/react';

interface Props {
  error: boolean;
  initialImage?: string;
  onFileUploaded: (file: File) => void
}

export const ImageInput: React.FC<Props> = ({ error, onFileUploaded, initialImage }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState(initialImage ?? '')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    const fileUrl = URL.createObjectURL(file)
    setSelectedFileUrl(fileUrl)
    onFileUploaded(file)
  }, [onFileUploaded])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <Flex 
      w='100%' 
      h='100%' 
      bg='gray.800'
      alignItems='center' 
      justifyContent='center' 
      {...getRootProps()} >
      <Input {...getInputProps()} accept='image/*' />

      {selectedFileUrl 
      ? <Image src={selectedFileUrl} alt='thumbnail' boxSize='lg' /> 
      :
        <Flex 
          align='center'
          direction='column'
          borderWidth='1px'
          borderStyle='dashed'
          borderColor='green.500'
          w='100%'
          h='100%'
          p='8'
        >
          <FiUpload fontSize='20' />
          <Text mt='1'>
            Imagem do produto
          </Text>
        </Flex>
      }
    </Flex>
  )
}
