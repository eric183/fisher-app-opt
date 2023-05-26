import { create } from "zustand";

const usePendingChat = create<{
  chatInfo: any;
  setChatInfo: (info: any) => void;
}>()((set) => ({
  chatInfo: undefined,
  setChatInfo: (_demand) =>
    set(() => ({
      chatInfo: _demand,
    })),
}));

export default usePendingChat;
