import { FormControl, FormErrorMessage, FormLabel, Textarea as ChakraInput, TextareaProps as ChakraInputProps } from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const TextAreaInputBase: ForwardRefRenderFunction<HTMLTextAreaElement, InputProps> = 
  ({ name, label, error = null, ...rest }, ref) => {

  return (
    <FormControl isInvalid={!!error}>
      { !!label && <FormLabel htmlFor='name'>{label}</FormLabel>}
      
      <ChakraInput
        id={name}
        name={name}
        focusBorderColor='green.500'
        bgColor='gray.900'
        variant='filled'
        _hover={{
          bgColor: 'gray.900'
        }} 
        size='lg'
        ref={ref}
        { ...rest } />

      { !!error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}

export const TextAreaInput = forwardRef(TextAreaInputBase);