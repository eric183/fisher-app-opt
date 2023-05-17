import { create } from "zustand";
import { TDemand } from "./demand";

interface IMatchState {
  matchInfo?: boolean | TDemand;
  setMatchInfo: (matchData: boolean | TDemand | undefined) => void;
}

const useMatch = create<IMatchState>()((set) => ({
  matchInfo: undefined,
  setMatchInfo: (matchData) =>
    set(() => ({
      matchInfo: matchData,
    })),
}));

export default useMatch;
