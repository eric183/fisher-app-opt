import { create } from "zustand";

export interface TDemand {
  id: number;
  created_time: string;
  English: string;
  Chinese: string;
  demandRole: string;
  userId: number;
}

interface IDemandState {
  demandStatus: TDemandStatus;
  setDemandStatus: (status: TDemandStatus) => void;
  alldemands: TDemand[];
  setAllDemands: (demands: TDemand[]) => void;
  pushDemand: (demand: TDemand) => void;
  pendingDemand?: TDemand;
  setPendingDemand: (demand: TDemand) => void;
}

const useDemands = create<IDemandState>()((set) => ({
  demandStatus: "IDLE",
  setDemandStatus: (demandStatus) => set(() => ({ demandStatus })),
  alldemands: [],
  setAllDemands: (demands) =>
    set(() => ({
      alldemands: demands,
    })),
  pushDemand: (demand) =>
    set(({ alldemands }) => ({
      alldemands: [...alldemands, demand],
    })),
  pendingDemand: undefined,
  setPendingDemand: (demand: TDemand) =>
    set({
      pendingDemand: demand,
    }),
}));

export default useDemands;
