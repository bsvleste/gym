import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useCallback, useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  exercisesId: string
}
export function Exercise() {
  const route = useRoute()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [subimitingRegister, setSubimitinRegister] = useState(false)
  const [exercises, setExercises] = useState<ExerciseDTO>({} as ExerciseDTO)
  const { exercisesId } = route.params as RouteParamsProps
  const { goBack } = useNavigation<AppNavigatorRoutesProps>()
  function handleGoBack() {
    goBack()
  }
  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exercisesId}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel buscar os dados, tente novamente"
      toast.show({
        title: `${title}`,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
  }
  async function handleExerciseHistoryRegister() {
    try {
      setSubimitinRegister(true)
      await api.post('/history', { exercise_id: exercisesId })
      toast.show({
        title: "Parabéns! Exercício completado com sucesso",
        placement: 'top',
        bgColor: "green.500"
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel refistrar o exercicio, tente novamente"
      toast.show({
        title: `${title}`,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setSubimitinRegister(false)
    }
  }
  useEffect(() => {
    fetchExerciseDetails()
  }, [exercisesId])
  return (
    <VStack flex={1}>
      <VStack
        px={8}
        bg={'gray.600'}
        pt={12} >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name='arrow-left' color={"green.500"} size={6} />
        </TouchableOpacity>
        <HStack
          alignItems={'center'}
          justifyContent={'space-between'}
          mt={4}
          mb={8}
        >
          <Heading
            flexShrink={1}
            color={'gray.100'}
            fontSize={'lg'}
            fontFamily={'heading'}
          >
            {exercises.name}
          </Heading>
          <HStack alignItems={'center'}>
            <BodySvg />
            <Text
              color={'gray.200'}
              ml={1}
              textTransform={'capitalize'}
            >
              {exercises.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {
        isLoading ?
          <Loading />
          :
          <ScrollView>
            <VStack
              p={8}
            >
              <Box
                rounded={'lg'}
                mb={3}
                overflow={'hidden'}
              >
                <Image
                  w={'full'}
                  h={80}
                  source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercises.demo}` }}
                  alt="Exemplo do exercicio"
                  resizeMode="cover"
                  rounded={'lg'}
                />
              </Box>
              <Box bg={'gray.600'} rounded={'md'} pb={4} px={4}>
                <HStack
                  mt={5}
                  mb={6}
                  justifyContent={'space-around'}
                  alignItems={'center'}>
                  <HStack>
                    <SeriesSvg />
                    <Text color={'gray.200'} ml={2}>{exercises.series} séries</Text>
                  </HStack>
                  <HStack>
                    <RepetitionSvg />
                    <Text color={'gray.200'} ml={2}>{exercises.repetitions} repetisões</Text>
                  </HStack>
                </HStack>
                <Button title='Marcar como realizado' isLoading={subimitingRegister} onPress={handleExerciseHistoryRegister} />
              </Box>
            </VStack>
          </ScrollView>
      }
    </VStack >
  )
}