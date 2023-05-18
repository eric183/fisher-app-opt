import { create } from "zustand";

export interface TDemand {
  id: string;
  created_time: string;
  English: string;
  Chinese: string;
  demandRole: string;
  userId: string;
  image?: string;
  title: string;
  place?: string;
  status: "CLOSED" | "OPEN" | "PENDING" | "COMPLETED";
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
