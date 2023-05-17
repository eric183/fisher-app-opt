import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { TUser } from "./user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IChat {
  content: string;
  user: Partial<TUser>;
}

export const chatStore = create<{
  chatStack?: any;
  setChatStack: (id: string, chat: IChat[]) => void;
}>()(
  persist(
    (set) => ({
      chatStack: {},
      setChatStack: (id, stackList) =>
        set(({ chatStack }) => {
          chatStack[id] = stackList;
          return {
            chatStack: chatStack,
          };
        }),
    }),
    {
      name: "chat-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
