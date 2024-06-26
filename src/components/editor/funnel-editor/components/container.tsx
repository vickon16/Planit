"use client";
import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn, handleDropOnContainerElement } from "@/lib/utils";
import CommonBadge from "./common-badge";
import CommonTrashIcon from "./common-trash-icon";
import Recursive from "./recursive";

type Props = { element: TEditorElement };

const Container = ({ element }: Props) => {
  const { editor, changeClickedElement, addElement } = useEditor();

  return (
    <div
      style={element.styles}
      className={cn("relative p-4 transition-all group max-w-full w-full h-fit", {
        "p-0" : editor.liveMode || editor.previewMode,
        "!border-primary/50":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "!border-solid":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !editor.liveMode,
      })}
      onDrop={(e) => handleDropOnContainerElement(e, addElement, element.id)}
      onDragOver={(e) => e.preventDefault()}
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

export default Container;
