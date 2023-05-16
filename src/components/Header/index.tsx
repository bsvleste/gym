import { Center, Text } from "native-base";
import GymLogoSVG from '@assets/logo.svg'
export function Header() {
  return (
    <Center my={16} >
      <GymLogoSVG />
      <Text
        color='gray.100'
        fontSize='sm'
        fontFamily='body'>
        Treine sua mente e seu corpo
      </Text>
    </Center>
  )
}
