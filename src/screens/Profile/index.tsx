import { useContext, useState } from "react";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert, TouchableOpacity } from "react-native";
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import userDefaultPhoto from '@assets/userPhotoDefault.png'

type FormDataProps = {
  email: string
  name: string
  password: string
  old_password: string
  confirm_password: string
}
const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 digitos').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup.string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password')], "A confirmação de senha não confere")
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema.nullable().transform((value) => !!value ? value : null).required('Informe a confirmação da senha.'),
    })
})
const PHOTO_SIZE = 33

export function Profile() {

  const { user, updateUserProfile } = useAuth()
  const { handleSubmit, control, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user?.name,
      email: user?.email
    },
    resolver: yupResolver(profileSchema)
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const toast = useToast()
  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 4],
      });
      if (photoSelected.canceled) {
        return
      }
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 3) {
          return toast.show({
            title: "Está imagem é muito grande.Escolha uma imagem de até 3MB",
            placement: 'top',
            bgColor: "red.500",
          })
        }
        // setUserPhoto(photoSelected.assets[0].uri)
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        const photoFile = {
          name: `${user?.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any
        const userPhtoUploadForm = new FormData()
        userPhtoUploadForm.append('avatar', photoFile)
        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhtoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)
        toast.show({
          title: "Imagem atualizada com sucesso",
          placement: 'top',
          bgColor: "green.500",
        })
      }

    } catch (error) {
      toast.show({
        title: "Ops! Não foi possivel carregar a foto",
        placement: 'top',
        bgColor: "red.500",
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }
  async function handleUpdateInfoUser(data: FormDataProps) {
    try {
      setIsUpdating(true)
      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)
      await updateUserProfile(userUpdated)

      toast.show({
        title: "Dados atualizados com sucesso",
        placement: 'top',
        bgColor: "green.500"
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel atualizar os dados, tente novamente"
      toast.show({
        title,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setIsUpdating(false)
    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
        <Center mt={'8'} px={'10'}>
          {
            photoIsLoading ?
              <Skeleton
                startColor={'gray.500'}
                endColor={'gray.600'}
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded={'full'} />
              :
              <UserPhoto
                source={user?.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user?.avatar}` } : userDefaultPhoto}
                alt="foto do usario"
                size={33}
              />
          }
          <TouchableOpacity
            onPress={handleUserPhotoSelect}
          >
            <Text
              color={'green.500'}
              fontWeight={'bold'}
              fontSize={'md'}
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Nome"
                bg={"gray.600"}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => (
              <Input
                isDisabled
                value={value}
                placeholder="Email"
                bg={"gray.600"}
              />
            )}
          />
        </Center>
        <VStack
          px={10}
          mt={12}
          mb={9}
        >
          <Heading
            color={'gray.200'}
            fontSize={'md'}
            mb={2}
            fontFamily={'heading'}
          >
            Alterar Senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="senha antiga"
                type="password"
                bg={"gray.600"}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="Nova senha"
                type="password"
                bg={"gray.600"}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="Confirme a nova senha"
                type="password"
                bg={"gray.600"}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button title="Atualizar" onPress={handleSubmit(handleUpdateInfoUser)} isLoading={isUpdating} />
        </VStack>
      </ScrollView>
    </VStack>
  )
}