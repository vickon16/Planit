"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import useEditor from "@/hooks/use-editor";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  AlignVerticalJustifyCenter,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from "lucide-react";

type Props = {
  handleOnChanges: (e: any) => void;
};

const DecorationsTab = ({ handleOnChanges }: Props) => {
  const { editor } = useEditor();
  const selectedElement = editor.selectedElement;

  const defaultSliderValue = !!selectedElement.styles?.opacity
    ? typeof selectedElement.styles.opacity === "number"
      ? selectedElement.styles.opacity
      : parseFloat(selectedElement.styles.opacity.replace("%", ""))
    : 0;

  const defaultBorderRadius = !!selectedElement.styles?.borderRadius
    ? typeof selectedElement.styles.borderRadius === "number"
      ? selectedElement.styles.borderRadius
      : parseFloat(selectedElement.styles.borderRadius.replace("px", ""))
    : 0;

  return (
    <>
      {/* Opacity */}
      <div>
        <Label className="text-muted-foreground">Opacity</Label>
        <div className="flex items-center justify-end">
          <small className="p-2">{defaultSliderValue}%</small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: { id: "opacity", value: `${e[0]}%` },
            });
          }}
          defaultValue={[defaultSliderValue]}
          max={100}
          step={1}
        />
      </div>

      <div>
        <Label className="text-muted-foreground">Border Radius</Label>
        <div className="flex items-center justify-end">
          <small className="">{defaultBorderRadius}px</small>
        </div>
        <Slider
          onValueChange={(e) => {
            handleOnChanges({
              target: {id: "borderRadius", value: `${e[0]}px`},
            });
          }}
          defaultValue={[defaultBorderRadius]}
          max={100}
          step={1}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Color</Label>
        <div className="flex  border-[1px] rounded-md overflow-clip">
          <div
            className="w-12 "
            style={{
              backgroundColor: selectedElement.styles.backgroundColor,
            }}
          />
          <Input
            placeholder="#HFI245"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundColor"
            onChange={handleOnChanges}
            value={selectedElement.styles.backgroundColor}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Background Image</Label>
        <div className="flex  border-[1px] rounded-md overflow-clip">
          <div
            className="w-12 "
            style={{
              backgroundImage: selectedElement.styles?.backgroundImage,
            }}
          />
          <Input
            placeholder="url()"
            className="!border-y-0 rounded-none !border-r-0 mr-2"
            id="backgroundImage"
            onChange={handleOnChanges}
            value={selectedElement.styles?.backgroundImage}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Image Position</Label>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "backgroundSize",
                value: e,
              },
            })
          }
          value={selectedElement.styles.backgroundSize?.toString()}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="cover"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <ChevronsLeftRightIcon size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="contain"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignVerticalJustifyCenter size={22} />
            </TabsTrigger>
            <TabsTrigger
              value="auto"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <LucideImageDown size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};

export default DecorationsTab;
