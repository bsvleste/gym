import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { getAuthTokenStorage, storageAuthToken, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { getUserStorage, removeUserStorage, storageUserSave } from "@storage/storageUser";
import { AppError } from "@utils/AppError";
import { useToast } from "native-base";
import { ReactNode, createContext, useEffect, useState } from "react";
export type AutContextdataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdate: UserDTO) => Promise<void>
  isLoading: boolean
  isLoadingUserStorageData: boolean
}

type AuthContextProps = {
  children: ReactNode
}
export const AuthContext = createContext<AutContextdataProps>({} as AutContextdataProps);

export function AuthContextProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const toast = useToast()

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }
  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthToken(token)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }
  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO);
      await storageAuthTokenRemove()
      await removeUserStorage()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }
  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true)
      const { data } = await api.post('/sessions', { email, password })
      if (data.user && data.token) {
        setIsLoadingUserStorageData(true)
        await storageUserAndTokenSave(data.user, data.token)
        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      const isAppErrro = error instanceof AppError;
      const errorTitle = isAppErrro ? error.message : 'Não foi possivel criar conta. Tente novamente mais tarde'
      if (isAppErrro) {
        toast.show({
          title: `${errorTitle}`,
          placement: 'top',
          bgColor: "red.500",
        })
        setIsLoading(false)
      }
    } finally {
      setIsLoading(false)
      setIsLoadingUserStorageData(false)
    }
  }
  async function getUserData() {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await getUserStorage()
      const token = await getAuthTokenStorage()
      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }
  async function updateUserProfile(userUpdate: UserDTO) {
    try {
      setUser(userUpdate)
      await storageUserSave(userUpdate)
    } catch (error) {
      throw error
    }
  }
  useEffect(() => {
    getUserData()
  }, [])
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUserProfile, isLoading, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  )
}