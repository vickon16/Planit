import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  color: string;
}

const TagComponent = ({ color, title }: Props) => {
  return (
    <div
      className={cn("px-2 py-1 rounded-sm flex-shrink-0 text-xs cursor-pointer border-2 text-foreground")}
      key={color}
      style={{ borderColor : color }}
    >
      {title}
    </div>
  );
};

export default TagComponent;
