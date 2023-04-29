import { create } from "zustand";

interface IDemandStatus {
  demandStatus: TDemandStatus;
  setDemandStatus: (status: TDemandStatus) => void;
}

const useDemandState = create<IDemandStatus>()((set) => ({
  demandStatus: "IDLE",
  setDemandStatus: (demandStatus) => set(()=> ({ demandStatus }))
}))

export default useDemandState;