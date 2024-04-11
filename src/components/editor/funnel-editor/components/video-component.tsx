"use client";

import useEditor, { TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import CommonBadge from "./common-badge";
import CommonTrashIcon from "./common-trash-icon";

type Props = {
  element: TEditorElement;
};

const VideoComponent = ({ element }: Props) => {
  const { editor, changeClickedElement } = useEditor();

  return (
    <div
      style={element.styles}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
      className={cn(
        "w-full p-2 relative transition-all",
        {
          "!border-primary/50": editor.selectedElement.id === element.id,
          "!border-solid": editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !editor.liveMode,
        }
      )}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonBadge text="Video" />
      )}

      <iframe
        width={element.styles.width || "560"}
        height={element.styles.height || "315"}
        src={element?.src || "https://www.youtube.com/embed/ScMzIvxBSi4"}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />

      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <CommonTrashIcon elementId={element.id} />
      )}
    </div>
  );
};

export default VideoComponent;
