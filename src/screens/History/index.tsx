import { useCallback, useState } from 'react';
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack, SectionList, Text, Center, useToast, ScrollView } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { HistoryGroupByDayDTO } from '@dtos/HistoryGroupByDayDTO';
import { useFocusEffect } from '@react-navigation/native';

export function History() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [exercicses, setExercises] = useState<HistoryGroupByDayDTO[]>([])
  async function fetchHisotry() {
    try {
      setIsLoading(true)
      const response = await api.get('/history')
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
  useFocusEffect(useCallback(() => {
    fetchHisotry()
  }, []))
  return (
    <VStack flex={1}>
      <ScreenHeader title="Historico de Treino" />
      <SectionList
        sections={exercicses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HistoryCard data={item} />
        )}
        renderSectionHeader={({ section }) => (
          <Heading
            color={"gray.100"}
            fontSize={"md"}
            mt={'10'}
            mb={'3'}
            fontFamily={'heading'}
          >
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={[].length === 0 && { justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <VStack mt={'16'}>
            <Center>
              <MaterialCommunityIcons name="weight-lifter" size={64} color={'white'} />
              <Text color={'gray.100'} textAlign={'center'} fontSize={'md'}>
                Não Há exercicios registrados ainda.Vamos treinar hoje?
              </Text>
            </Center>
          </VStack>
        )}
      />

    </VStack>
  )
}