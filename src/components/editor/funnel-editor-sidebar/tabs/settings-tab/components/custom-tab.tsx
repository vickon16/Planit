"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import useEditor from "@/hooks/use-editor";

const CustomTab = () => {
  const { editor, updateElement } = useEditor();
  const selectedElement = editor.selectedElement;

  return (
    <>
     { selectedElement.type === "link" && (
      <AccordionContent>
        <div className="flex flex-col gap-2 w-full px-1">
          <p className="text-muted-foreground">Link Path</p>
          <Input
            placeholder="https:domain.example.com/pathname"
            onChange={(e) => {
              updateElement({
                ...selectedElement,
                href: e.target.value,
              });
            }}
            value={selectedElement?.href || ""}
          />
        </div>
      </AccordionContent>
      )}

     { selectedElement.type === "image" && (
      <AccordionContent>
        <div className="flex flex-col gap-2 w-full px-1">
          <p className="text-muted-foreground">Image Src</p>
          <Input
            placeholder="https:domain.example.com/pathname"
            onChange={(e) => {
              updateElement({
                ...selectedElement,
                src: e.target.value,
              });
            }}
            value={selectedElement?.src || ""}
          />
        </div>
      </AccordionContent>
      )}

    </>
  );
};

export default CustomTab;
