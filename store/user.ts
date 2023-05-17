import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { TDemand } from "./demand";

export type TUser = {
  username?: string;
  email: string;
  password?: string;
  avatar?: string;
  id: string;
  demandCount?: number;
  demands?: TDemand[];
};

export interface TUserState {
  user: TUser | undefined;
  setUser: (u: TUser) => void;
  toUser: Partial<TUser> | undefined;
  setToUser: (u: Partial<TUser>) => void;
}
// const currentUser = AsyncStorage.getItem("userInfo");
const useUser = create<TUserState>()((set) => ({
  user: undefined,
  setUser: (newUser) =>
    set(() => ({
      user: newUser,
    })),

  // to user
  toUser: undefined,
  setToUser: (newUser) =>
    set(() => ({
      toUser: newUser,
    })),
}));

export default useUser;
