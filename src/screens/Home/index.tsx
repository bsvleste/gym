import { useCallback, useEffect, useState } from "react"
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { FlatList, HStack, Heading, ScrollView, Text, VStack, useToast } from "native-base";
import { ExerciseCard } from "@components/ExerciseCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exercisesId: string) {
    navigate('exercise', { exercisesId })
  }
  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel buscar os dados, tente novamente"
      toast.show({
        title,
        placement: 'top',
        bgColor: "red.500"
      })
    }
  }
  async function fecthExercisesByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel buscar os dados, tente novamente"
      toast.show({
        title,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchGroups()
  }, [])
  useFocusEffect(useCallback(() => {
    fecthExercisesByGroup()
  }, [groupSelected]))
  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8
        }}
        my={10}
        maxH={10}
        minH={10}
      />
      {
        isLoading ?
          <Loading />
          :
          <VStack flex={1} px={8}>
            <HStack justifyContent={'space-between'} mb={5}>
              <Heading
                color={'gray.200'}
                fontSize={'md'}
                fontFamily={'heading'}
              >
                Exercicios
              </Heading>
              <Text color={'gray.200'} fontSize={'md'}>{exercises.length}</Text>
            </HStack >
            <FlatList
              data={exercises}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ExerciseCard onPress={() => handleOpenExerciseDetails(item.id)} data={item} />
              )}
              showsHorizontalScrollIndicator={false}
              _contentContainerStyle={{
                paddingBottom: 20,
              }}
            />
          </VStack >
      }
    </VStack >
  )
}