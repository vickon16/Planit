"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import ClientOnly from "../client-only";
import { zPriority } from "@/lib/utils";

type Props = {
  heading: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  confirmAction: () => void;
  confirmActionLabel: string;
  isLoadingConfirmAction?: boolean;
};

const ConfirmActionModal = ({
  heading,
  confirmAction,
  confirmActionLabel,
  isLoadingConfirmAction,
  description,
  children,
}: Props) => {
  return (
    <ClientOnly>
      <AlertDialog>
        {children}
        <AlertDialogContent className={zPriority.pr4}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">{heading}</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoadingConfirmAction}
              className="bg-destructive hover:bg-destructive"
              onClick={confirmAction}
            >
              {isLoadingConfirmAction ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                confirmActionLabel
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ClientOnly>
  );
};

export default ConfirmActionModal;
