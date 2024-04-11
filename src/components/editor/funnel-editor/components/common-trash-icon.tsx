"use client";

import useEditor from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  elementId: string;
  className?: string;
};

const CommonTrashIcon = ({ elementId, className }: Props) => {
  const { deleteElement } = useEditor();
  return (
    <div
      className={cn(
        "absolute text-primary cursor-pointer text-[10px] -top-[8px] -right-2 rounded-none ",
        className
      )}
    >
      <X size={15} onClick={() => deleteElement(elementId)} />
    </div>
  );
};

export default CommonTrashIcon;
