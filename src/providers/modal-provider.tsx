"use client";

import ClientOnly from "@/components/client-only";
import useDisplayModal from "@/hooks/use-display-modal";

const ModalProvider = () => {
  const { modalContent } = useDisplayModal();
  return <ClientOnly>{modalContent}</ClientOnly> ;
};

export default ModalProvider;
