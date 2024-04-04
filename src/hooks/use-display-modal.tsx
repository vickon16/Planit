import { Agency, User } from "@prisma/client";
import { create } from "zustand";

export type ModalData = {
  user?: User;
  agency?: Agency;
};

interface DisplayModalStore {
  isOpen: boolean;
  modalContent: React.ReactNode | JSX.Element | null;
  setOpen: (modalContent: React.ReactNode | JSX.Element) => void;
  setClose: () => void;
}

const useDisplayModal = create<DisplayModalStore>((set) => ({
  isOpen: false,
  modalContent: null,
  setOpen: async (modalContent) => {
    set({ isOpen: false, modalContent: null });

    if (modalContent) {
      set({ modalContent, isOpen: true });
    }
  },
  setClose: () => set({ isOpen: false, modalContent: null }),
}));

export default useDisplayModal;
