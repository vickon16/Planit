"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn, zPriority } from "@/lib/utils";
import useDisplayModal from "@/hooks/use-display-modal";

type Props = {
  title: string;
  subheading?: string;
  children: React.ReactNode;
  className? : string;
};

const CustomModal = ({ children, subheading, title, className }: Props) => {
  const {isOpen, setClose} = useDisplayModal();
  return (
      <Dialog open={isOpen} onOpenChange={setClose}>
        <DialogContent className={cn("overflow-auto md:max-h-[800px] h-[100svh] bg-card ", zPriority.pr4, className)}>
          <DialogHeader className="mt-6 mb-4 text-left">
            <DialogTitle className="!text-clampBase font-bold">{title}</DialogTitle>
            {subheading && <DialogDescription>{subheading}</DialogDescription>}
          </DialogHeader>
            {children}
        </DialogContent>
      </Dialog>
  );
};

export default CustomModal;
