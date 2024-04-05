"use client";

import { Button } from "@/components/ui/button";
import useEditor from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import { FunnelPage } from "@prisma/client";
import { EyeOff } from "lucide-react";
import { useEffect } from "react";
import Recursive from "./components/recursive";

type Props = {
  liveMode?: boolean;
};

const FunnelEditor = ({ liveMode }: Props) => {
  const { toggleLiveMode, togglePreviewMode, editor } = useEditor();

  useEffect(() => {
    if (liveMode) toggleLiveMode(true);
  }, [liveMode, toggleLiveMode]);

  const handleUnPreview = () => {
    toggleLiveMode(false);
    togglePreviewMode(false);
  };

  return (
    <section className="h-full flex items-center flex-col">
      <div
        className={cn(
          "animate-automation-zoom-in h-full overflow-auto pr-[380px] bg-background transition-all rounded-md ",
          {
            "!p-0 !mr-0":
              editor.previewMode === true || editor.liveMode === true,
            "!w-[1450px]": editor.device === "Tablet",
            "!w-[1000px]": editor.device === "Mobile",
            "w-full": editor.device === "Desktop",
          }
        )}
      >
        {(editor.previewMode || editor.liveMode) && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-6 h-6 bg-slate-600 p-[2px] fixed top-2 left-2"
            onClick={handleUnPreview}
          >
            <EyeOff />
          </Button>
        )}

        <div className="w-full h-full">
          {Array.isArray(editor.elements) &&
            editor.elements.map((childElement) => (
              <Recursive key={childElement.id} element={childElement} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FunnelEditor;
