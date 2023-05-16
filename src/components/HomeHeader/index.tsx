import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { UserPhoto } from "@components/UserPhoto";
import userDefaultPhoto from '@assets/userPhotoDefault.png'
import { TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
export function HomeHeader() {
  const { user, signOut } = useAuth()
  function handleSignOut() {
    signOut()
  }
  return (
    <HStack
      bg="gray.600"
      pt={16}
      px={8}
      pb={5}
      alignItems='center'

    >
      <UserPhoto mr={4} size={16} source={user?.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user?.avatar}` } : userDefaultPhoto} alt="foto do usuario" />
      <VStack flex={1}>
        <Text color='gray.100' fontSize='md' fontFamily={'heading'}>Ola</Text>
        <Heading
          color='gray.100'
          fontSize='md'
          fontFamily={'heading'}>
          {user?.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon
          as={MaterialIcons}
          name="logout"
          color='gray.200'
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}