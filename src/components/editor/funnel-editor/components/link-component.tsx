"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CommonTrashIcon from "./common-trash-icon";
import CommonBadge from "./common-badge";

type Props = {
  element: TEditorElement;
};

const LinkComponent = ({ element }: Props) => {
  const { editor, changeClickedElement, updateElement } = useEditor();

  return (
    <div
      style={element.styles}
      className={cn("px-4 py-1 w-full relative transition-all", {
        "border-dashed border-[1px] border-slate-300": !editor.liveMode,
      })}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text={"Link"} />
      )}

      {editor.previewMode || editor.liveMode ? (
        <Link href={element?.href || "#"} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {element?.innerText}
        </Link>
      ) : (
        <span
          className="w-full border-none outline-none whitespace-nowrap"
          contentEditable={!editor.liveMode}
          onBlur={(e) =>
            updateElement({ ...element, innerText: e.target.innerText })
          }
        >
          {element?.innerText}
        </span>
      )}
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default LinkComponent;
