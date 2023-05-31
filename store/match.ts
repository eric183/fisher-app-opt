import { create } from "zustand";
import { TDemand } from "./demand";

export interface IMatchResponse {
  matchedItem?: TDemand;
}
interface IMatchState {
  matchInfo?: boolean | TDemand | IMatchResponse;
  setMatchInfo: (
    matchData: boolean | TDemand | IMatchResponse | undefined
  ) => void;
}

const useMatch = create<IMatchState>()((set) => ({
  matchInfo: undefined,
  setMatchInfo: (matchData) =>
    set(() => ({
      matchInfo: matchData,
    })),
}));

export default useMatch;
