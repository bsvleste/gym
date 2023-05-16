import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useForm, Controller } from 'react-hook-form'
import { VStack, Image, Center, Heading, ScrollView, Toast, useToast } from 'native-base'
import BackgroundOImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Header } from '@components/Header'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

type SignupProps = {
  name: string
  email: string
  password: string
  confirm_password: string
}
const signupSchema = yup.object({
  name: yup.string().required('Infome o nome'),
  email: yup.string().required("Informe o E-mail").email("E-mail invalido"),
  password: yup.string().required('Infome a senha').min(6, "A senha deve conter no minimo 6 digitos"),
  confirm_password: yup.string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password')], "As senhas não conferem!"),
})
export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const toast = useToast()
  const { handleSubmit, control, formState: { errors } } = useForm<SignupProps>({
    resolver: yupResolver(signupSchema)
  })
  const { goBack } = useNavigation<AuthNavigatorRoutesProps>()
  function handleNavigateToSignIn() {
    goBack()
  }
  async function handleSignUp({ name, email, password }: SignupProps) {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      toast.show({
        title: "Usuario cadastrado com sucesso",
        placement: 'top',
        bgColor: "green.500",
      })
      await signIn(email, password)

    } catch (error) {
      setIsLoading(false)
      const isAppErrro = error instanceof AppError;
      const errorTitle = isAppErrro ? error.message : 'Não foi possivel criar conta. Tente novamente mais tarde'
      if (isAppErrro) {
        toast.show({
          title: `${errorTitle}`,
          placement: 'top',
          bgColor: "red.500",
        })
      }
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        px={5}
        flex={1}
        pb={16}
      >
        <Image
          position="absolute"
          resizeMode='contain'
          alt='pessoal malhando'
          source={BackgroundOImg}
          defaultSource={BackgroundOImg}
        />
        <Header />
        <Center >
          <Heading
            color="gray.100"
            fontSize='xl'
            mb={6}
            fontFamily='heading'>
            Crie sua conta
          </Heading>
        </Center>
        <Center mb={6}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Nome'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='E-mail'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Password'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Confirme o password'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button
            title='Criar e acessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>
        <Button title='Voltar para o login' variant='outline' mt='12' onPress={handleNavigateToSignIn} />
      </VStack>
    </ScrollView>
  )
}