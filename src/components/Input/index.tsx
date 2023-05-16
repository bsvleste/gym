import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type InputProps = IInputProps & {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...props }: InputProps) {
  const invalid = !!errorMessage || isInvalid
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        h={14}
        px={14}
        bg="gray.700"
        borderWidth={0}
        fontSize='md'
        color="white"
        fontFamily='body'
        isInvalid={invalid}
        placeholderTextColor='gray.300'
        _invalid={
          {
            borderColor: 'red.500',
            borderWidth: 1,
          }
        }
        _focus={{
          bg: "gray.700",
          borderWidth: 1,
          borderColor: 'green.500'
        }}

        {...props}
      />
      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}