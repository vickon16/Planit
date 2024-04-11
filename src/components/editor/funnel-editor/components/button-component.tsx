"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import CommonBadge from "./common-badge";
import CommonTrashIcon from "./common-trash-icon";
import { Button } from "@/components/ui/button";

type Props = {
  element: TEditorElement;
};

const ButtonComponent = ({ element }: Props) => {
  const { editor, changeClickedElement, updateElement } = useEditor();

  return (
    <div
      style={element.styles}
      className={cn(
        "px-4 py-1 w-full relative transition-all",
        {
          "border-dashed border-[1px] border-slate-300": !editor.liveMode,
        }
      )}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text="Text" />
      )}

      <Button
        className="w-full border-none outline-none whitespace-nowrap"
        contentEditable={!editor.liveMode}
        onBlur={(e) => updateElement({...element, innerText : e.target.innerText})}
      >
        {element?.innerText}
      </Button>
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default ButtonComponent;
