import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
type ButtonProps = IButtonProps & {
  title: string
  variant?: 'solid' | 'outline'
}

export function Button({ title, variant = 'solid', ...props }: ButtonProps) {
  return (
    <NativeBaseButton
      w='full'
      h={14}
      bg={variant === "outline" ? "transparent" : 'green.700'}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor='green.500'
      rounded='md'
      _pressed={{
        bg: variant === "outline" ? 'gray.500' : 'green.500',
        borderWidth: variant === 'outline' ? 0 : 1
      }}
      {...props}
    >
      <Text
        color={variant === "outline" ? 'green.500' : 'white'}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}