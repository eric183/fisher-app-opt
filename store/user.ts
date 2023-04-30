import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface TDemand {
  id:           number;
  created_time: string;
  English:      string;
  Chinese:      string;
  demandRole:   string;
  userId:       number;
}

export type TUser = {
  email: string;
  password?: string;
  avatar?: string;
  id: number;
  demandCount?: number;
  demands?: TDemand[];
} 

export interface TUserState {
  user: TUser | undefined;
  setUser: (u: TUser) => void;
}
// const currentUser = AsyncStorage.getItem("userInfo");
const useUser = create<TUserState>()((set) => ({
  user: undefined,
  setUser: (newUser) => set(() => ({
    user: newUser
  }))
}))


export default useUser;