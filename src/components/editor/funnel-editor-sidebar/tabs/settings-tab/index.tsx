"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useEditor from "@/hooks/use-editor";

import CustomTab from "./components/custom-tab";
import DecorationsTab from "./components/decorations-tab";
import DimensionsTab from "./components/dimensions.tab";
import FlexBoxTab from "./components/flexbox-tab";
import TypographyTab from "./components/typography-tab";

const accordionTypes = [
  "Custom",
  "Typography",
  "Dimensions",
  "Decorations",
  "Flexbox",
];

const SettingsTab = () => {
  const { editor, updateElement } = useEditor();
  const selectedElement = editor.selectedElement;

  const handleOnChanges = (e: any) => {
    const styleObject = {
      [e.target.id]: e.target.value,
    }

    updateElement({
      ...selectedElement,
      styles: {
        ...selectedElement.styles,
        ...styleObject,
      }
    });
  }


  return (
    <Accordion
      type="multiple"
      className="w-full !py-0"
      defaultValue={accordionTypes}
    >
      {/* Custom */}
      <AccordionItem value="Custom" className="!py-0 ">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <CustomTab />
      </AccordionItem>

      {/* Typography */}
      <AccordionItem value="Typography" className="!py-0 ">
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 ">
          <TypographyTab handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>

      {/* Dimensions */}
      <AccordionItem value="Dimensions" className="!py-0 ">
        <AccordionTrigger className="!no-underline">
          Dimensions (Px)
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 ">
          <DimensionsTab handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>

      {/* Dimensions */}
      <AccordionItem value="Decorations" className="!py-0 ">
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <DecorationsTab handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>

      {/* FlexBox */}
      <AccordionItem value="Flexbox" className="!py-0 ">
        <AccordionTrigger className="!no-underline">
          Flexbox
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <FlexBoxTab handleOnChanges={handleOnChanges} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
