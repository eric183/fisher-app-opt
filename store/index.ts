import { create } from "zustand";

interface IndexState {
  demand: string;
  setDemand: (by: string) => void;
}

const useIndexState = create<IndexState>()((set) => ({
  demand: "",
  setDemand: (demand) => set(() => ({ demand })),
}));

export default useIndexState;
