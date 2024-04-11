"use client";

import { Button } from "@/components/ui/button";
import useEditor from "@/hooks/use-editor";
import { cn, handleDropOnContainerElement, zPriority } from "@/lib/utils";
import { EyeOff } from "lucide-react";
import { useEffect } from "react";
import CommonBadge from "./components/common-badge";
import Recursive from "./components/recursive";

type Props = {
  liveMode?: boolean;
};

const FunnelEditor = ({ liveMode }: Props) => {
  const { addElement, toggleLiveMode, togglePreviewMode, editor } = useEditor();

  useEffect(() => {
    if (liveMode) {
      toggleLiveMode(true);
      togglePreviewMode(true);
    };
  }, [liveMode, toggleLiveMode, togglePreviewMode]);

  const handleUnPreview = () => {
    toggleLiveMode(false);
    togglePreviewMode(false);
  };

  return (
    <section className="flex items-center flex-col h-full">
      <div
        className={cn(
          "animate-automation-zoom-in pr-[380px] overflow-hidden bg-background transition-all rounded-md ",
          {
            "!p-0 !mr-0":
              editor.previewMode === true || editor.liveMode === true,
            "!w-[1450px]": editor.device === "Tablet",
            "!w-[1000px]": editor.device === "Mobile",
            "w-full": editor.device === "Desktop",
          }
        )}
      >
        {(editor.previewMode && editor.liveMode) && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "w-6 h-6 bg-slate-600 p-[2px] fixed top-2 left-2",
              zPriority.pr4
            )}
            onClick={handleUnPreview}
          >
            <EyeOff />
          </Button>
        )}

        {/* element body */}
        <div
          className={cn(
            "bg-white p-2 space-y-2 w-full max-w-full h-full min-h-screen overflow-auto relative pb-32"
          )}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => handleDropOnContainerElement(e, addElement, "__body")}
        >
          {(!editor.previewMode && !editor.liveMode) && (
            <CommonBadge
              text="body"
              className="top-0 left-0 transform-none h-fit"
            />
          )}

          {Array.isArray(editor.elementBody.content) &&
            editor.elementBody.content.map((childElement) => (
              <Recursive key={childElement.id} element={childElement} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FunnelEditor;
