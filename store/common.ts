import { create } from "zustand";
import { TDemand } from "./demand";
import { TUser } from "./user";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TRequestChat = {
  user: Partial<TUser>;
  message: string;
  demandId?: string;
  type: string;
};

interface ICommonState {
  contacts: TUser[];
  setContacts: (user: TUser) => void;

  // chattingUser: TUser;
  // pickChatUserWithDemand: (u: any) => void;
  requestUsersWithChats: TRequestChat[];
  setUsersWithChats: (chat: TRequestChat) => void;
}

const useCommonStore = create<ICommonState>()(
  persist(
    (set) => ({
      contacts: [],
      setContacts: (_user) =>
        set(({ contacts }) => ({
          contacts: [...contacts, _user],
        })),

      requestUsersWithChats: [],
      setUsersWithChats: (_request) =>
        set(({ requestUsersWithChats }) => {
          return {
            requestUsersWithChats: [...requestUsersWithChats, _request],
          };
        }),
    }),
    {
      name: "common-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCommonStore;
