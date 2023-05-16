import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'
import BackgroundOImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Header } from '@components/Header'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

type SigninProps = {
  email: string
  password: string
}
const signupSchema = yup.object({
  email: yup.string().required("Informe o E-mail").email("E-mail invalido"),
  password: yup.string().required('Infome a senha').min(6, "A senha deve conter no minimo 6 digitos"),
})

export function SignIn() {
  const { signIn, isLoading } = useAuth()
  const toast = useToast()
  const { handleSubmit, control, formState: { errors } } = useForm<SigninProps>({
    resolver: yupResolver(signupSchema)
  })
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  function handleNavigateToSignUp() {
    navigation.navigate("signUp")
  }
  function handleSignIn({ email, password }: SigninProps) {
    signIn(email, password)
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
          source={BackgroundOImg}
          defaultSource={BackgroundOImg}
          alt='pessoal malhando'
        />
        <Header />
        <Center>
          <Heading
            color="gray.100"
            fontSize='xl'
            mb={6}
            fontFamily='heading'>
            Acesse sua conta
          </Heading>
        </Center>
        <Center mb={6}>
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
                returnKeyType='send'
                onSubmitEditing={handleSubmit(handleSignIn)}
              />
            )}
          />
          <Button title='Acessar' onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
        </Center>
        <Center mt={16}>
          <Text
            color='gray.100'
            fontFamily='body'
            fontSize='sm'
            mb={3}>
            Ainda não tem acesso?</Text>
          <Button
            title='Criar
            conta'
            variant='outline'
            onPress={handleNavigateToSignUp} />
        </Center>
      </VStack>
    </ScrollView>
  )
}