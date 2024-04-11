"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import Recursive from "./recursive";
import CommonTrashIcon from "./common-trash-icon";
import CommonBadge from "./common-badge";

type Props = { element: TEditorElement };

const TwoContainers = ({ element }: Props) => {
  const { editor, changeClickedElement } = useEditor();
  return (
    <div
      className={cn(
        "w-full p-4 max-w-full relative transition-all group h-fit flex flex-row gap-x-0.5",
        {
          "flex-col": editor.device === "Mobile",
          "p-0": editor.liveMode || editor.previewMode,
          "!border-primary/50":
            editor.selectedElement.id === element.id && !editor.liveMode,
          "!border-solid":
            editor.selectedElement.id === element.id && !editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !editor.liveMode,
        }
      )}
      style={element.styles}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text={element.name} />
      )}
      {Array.isArray(element.content) &&
        element.content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}

      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default TwoContainers;
