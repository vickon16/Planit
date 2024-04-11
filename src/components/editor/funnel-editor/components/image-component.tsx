"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import CommonBadge from "./common-badge";
import CommonTrashIcon from "./common-trash-icon";
import Image from "next/image";

type Props = {
  element: TEditorElement;
};

const ImageComponent = ({ element }: Props) => {
  const { editor, changeClickedElement } = useEditor();

  return (
    <div
      style={element.styles}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
      className={cn("p-2 relative transition-all w-full h-[300px]", {
        "!border-primary/50": editor.selectedElement.id === element.id,
        "!border-solid": editor.selectedElement.id === element.id,
        "border-dashed border-[1px] border-slate-300": !editor.liveMode,
      })}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text="Image" />
      )}
        <Image
          src={element?.src || "/assets/preview.png"}
          alt="Image source"
          className="w-full h-full object-contain"
          fill
        />

      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default ImageComponent;
