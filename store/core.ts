import { create } from "zustand";

const coreStore = create<{
  coreInfo: any;
  setCoreInfo: (_coreInfo: any) => void;
}>()((set) => {
  return {
    coreInfo: {},
    setCoreInfo: (_coreInfo: any) => set(() => ({ coreInfo: _coreInfo })),
  };
});

export default coreStore;
