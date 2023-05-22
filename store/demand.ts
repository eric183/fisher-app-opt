import { create } from "zustand";

export interface TDemand {
  id: string;
  created_time: string;
  English: string;
  Chinese: string;
  demandRole: "NEED" | "SERVER" | "FREE";
  userId: string;
  images: string[];
  title: string;
  place?: string;
  categoryType:
    | "Social"
    | "Work"
    | "Home"
    | "Health"
    | "Shopping"
    | "Travel"
    | "Learning"
    | "Entertainment"
    | "Transportation"
    | "Finance";
  status: "CLOSED" | "OPEN" | "PENDING" | "COMPLETED";
}

interface IDemandState {
  demandStatus: TDemandStatus;
  setDemandStatus: (status: TDemandStatus) => void;
  alldemands: TDemand[];
  setAllDemands: (demands: TDemand[]) => void;
  setSingleDemand: (demand: TDemand) => void;
  pushDemand: (demand: TDemand) => void;
  pendingDemand?: TDemand;
  setPendingDemand: (demand: TDemand) => void;
}

const useDemands = create<IDemandState>()((set) => ({
  demandStatus: "IDLE",
  setDemandStatus: (demandStatus) => set(() => ({ demandStatus })),
  alldemands: [],
  setSingleDemand: (demand) =>
    set(({ alldemands }) => {
      const _allDemand = [...alldemands];

      _allDemand.forEach((_demand) => {
        if (demand.id === _demand.id) {
          _demand.status = demand.status;
        }
      });
      return {
        alldemands: [..._allDemand],
      };
    }),
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
