"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useEditor from "@/hooks/use-editor";
import {
  AlignCenter,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
} from "lucide-react";

type Props = {
  handleOnChanges: (e: any) => void;
};

const TypographyTab = ({ handleOnChanges }: Props) => {
  const { editor } = useEditor();
  const selectedElement = editor.selectedElement;

  return (
    <>
      <div className="flex flex-col gap-2 ">
        <p className="text-muted-foreground">Text Align</p>
        <Tabs
          onValueChange={(e) =>
            handleOnChanges({
              target: {
                id: "textAlign",
                value: e,
              },
            })
          }
          value={selectedElement.styles.textAlign}
        >
          <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
            <TabsTrigger
              value="start"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              title="start"
            >
              <AlignStartVertical size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="left"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              title="left"
            >
              <AlignLeft size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="right"
              title="right"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignRight size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="center"
              title="center"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <AlignCenter size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="justify"
              title="justify"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignJustify size={18} />
            </TabsTrigger>
            <TabsTrigger
              value="end"
              title="end"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted "
            >
              <AlignEndVertical size={18} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Font Family</p>
        <Input
          id="fontFamily"
          onChange={handleOnChanges}
          value={selectedElement.styles.fontFamily}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">Color</p>
        <Input
          id="color"
          onChange={handleOnChanges}
          value={selectedElement.styles.color}
        />
      </div>
      <div className="flex gap-4">
        <div>
          <Label className="text-muted-foreground">Weight</Label>
          <Select
            value={(selectedElement.styles?.fontWeight || "normal") as any}
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "fontWeight",
                  value: e,
                },
              })
            }
          >
            <SelectTrigger className="w-[180px]" style={{ fontWeight: "" }}>
              <SelectValue placeholder="Select a weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="initial">Initial</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="lighter">Light</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground">Size(px)</Label>
          <Input
            placeholder="e.g 50px"
            id="fontSize"
            onChange={handleOnChanges}
            value={selectedElement.styles.fontSize}
          />
        </div>
      </div>
    </>
  );
};

export default TypographyTab;
