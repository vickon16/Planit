"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useEditor from "@/hooks/use-editor";
import React from "react";

type Props = {
  handleOnChanges: (e: any) => void;
};

type TDimensions = {
  value: string;
  label: string;
};

const dimensionsArray: TDimensions[] = [
  { value: "height", label: "Height" },
  { value: "width", label: "Width" },
  { value: "marginTop", label: "Margin Top" },
  { value: "marginBottom", label: "Margin Bottom" },
  { value: "marginLeft", label: "Margin Left" },
  { value: "marginRight", label: "Margin Right" },
  { value: "paddingTop", label: "Padding Top" },
  { value: "paddingBottom", label: "Padding Bottom" },
  { value: "paddingLeft", label: "Padding Left" },
  { value: "paddingRight", label: "Padding Right" },
];

const DimensionsTab = ({ handleOnChanges }: Props) => {
  const { editor } = useEditor();
  const selectedElement = editor.selectedElement;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 w-full items-center justify-between">
        {dimensionsArray.map((dimension) => (
          <div className="space-y-1 basis-[45%]" key={dimension.value}>
            <Label className="text-muted-foreground">{dimension.label}</Label>
            <Input
              id={dimension.value}
              placeholder="e.g 10px"
              onChange={handleOnChanges}
              // @ts-ignore
              value={selectedElement.styles[dimension.value]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DimensionsTab;
