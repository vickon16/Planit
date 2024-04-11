"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useEditor from "@/hooks/use-editor";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
} from "lucide-react";

type Props = {
  handleOnChanges: (e: any) => void;
};

const FlexBoxTab = ({ handleOnChanges }: Props) => {
  const { editor } = useEditor();
  const selectedElement = editor.selectedElement;

  const justifyTabTriggers = [
    { value: "space-between", icon: AlignHorizontalSpaceBetween },
    { value: "space-evenly", icon: AlignHorizontalSpaceAround },
    { value: "center", icon: AlignHorizontalJustifyCenter },
    { value: "start", icon: AlignHorizontalJustifyStart },
    { value: "end", icon: AlignHorizontalJustifyEnd },
  ];
  const alignTabTriggers = [
    { value: "center", icon: AlignVerticalJustifyCenter },
    { value: "normal", icon: AlignVerticalJustifyStart },
    { value: "start", icon: AlignHorizontalJustifyStart },
    { value: "end", icon: AlignHorizontalJustifyEnd },
  ];

  return (
    <>
      <Label className="text-muted-foreground">Justify Content</Label>
      <Tabs
        onValueChange={(e) =>
          handleOnChanges({
            target: { id: "justifyContent", value: e },
          })
        }
        value={selectedElement.styles.justifyContent}
      >
        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
          {justifyTabTriggers.map((trigger) => (
            <TabsTrigger
              value={trigger.value}
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              key={trigger.value}
              title={trigger.value}
            >
              <trigger.icon size={18} />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Label className="text-muted-foreground">Align Items</Label>
      <Tabs
        onValueChange={(e) =>
          handleOnChanges({
            target: { id: "alignItems", value: e },
          })
        }
        value={selectedElement.styles.alignItems}
      >
        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
          {alignTabTriggers.map((trigger) => (
            <TabsTrigger
              value={trigger.value}
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              key={trigger.value}
              title={trigger.value}
            >
              <trigger.icon size={18} />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Label className="text-muted-foreground">Display</Label>
      <div className="flex items-center gap-2">
        <Input
          className="h-4 w-4"
          placeholder="px"
          type="checkbox"
          id="display"
          checked={selectedElement.styles?.display === "flex" ? true : false}
          onChange={(e) => {
            handleOnChanges({
              target: {
                id: "display",
                value: e.target.checked ? "flex" : "block",
              },
            });
          }}
        />
        <Label className="text-muted-foreground">Flex</Label>
      </div>

      <Label className="text-muted-foreground">Gap</Label>
      <Input
        placeholder="e.g 10px"
        id="gap"
        onChange={(e) => {
          handleOnChanges({
            target: {
              id: "gap",
              value: e.target.value,
            },
          });
        }}
        value={selectedElement.styles?.gap}
      />

      <Label className="text-muted-foreground">Flex Direction</Label>
      <div className="flex items-center gap-2" >
         <Input
          className="h-4 w-4"
          placeholder="px"
          type="checkbox"
          id="flexDirection"
          checked={selectedElement.styles?.flexDirection === "column" ? true : false}
          onChange={(e) => {
            handleOnChanges({
              target: {
                id: "flexDirection",
                value: e.target.checked ? "column" : "row",
              },
            });
          }}
        />
        <Label className="text-muted-foreground">Column</Label>
      </div>
    </>
  );
};

export default FlexBoxTab;
