import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { TEditorButtons } from "@/hooks/use-editor";
import { Separator } from "@/components/ui/separator";
import {
  Contact2Icon,
  Link2Icon,
  LucideIcon,
  Play,
  TypeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import ContainerPlaceholder from './container-placeholder'
// import VideoPlaceholder from './video-placeholder'
// import TwoColumnsPlaceholder from './two-columns-placeholder'
// import LinkPlaceholder from './link-placeholder'
// import ContactFormComponentPlaceholder from './contact-form-placeholder'
// import CheckoutPlaceholder from './checkout-placeholder'

type ComponentTabType = "Layout" | "Element";

const elements: {
  className: string;
  icon?: LucideIcon;
  withoutIconClassName?: string;
  label: string;
  id: TEditorButtons;
  group: ComponentTabType;
}[] = [
  {
    className: "flex items-center justify-center",
    icon: TypeIcon,
    label: "Text",
    id: "text",
    group: "Element",
  },
  {
    className: "flex flex-row gap-[4px]",
    withoutIconClassName:
      "border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full",
    label: "Container",
    id: "container",
    group: "Layout",
  },
  {
    className: "flex flex-row gap-[4px]",
    withoutIconClassName:
      "border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full",
    label: "2 Columns",
    id: "2Col",
    group: "Layout",
  },
  {
    icon: Play,
    className: "flex items-center justify-center",
    label: "Video",
    id: "video",
    group: "Layout",
  },
  {
    icon: Contact2Icon,
    className: "flex items-center justify-center",
    label: "Contact",
    id: "contactForm",
    group: "Element",
  },
  {
    icon: Link2Icon,
    className: "flex items-center justify-center",
    label: "Link",
    id: "link",
    group: "Element",
  },
];

const AccordionItemComponent = ({
  itemType,
}: {
  itemType: ComponentTabType;
}) => {
  const handleDragState = (e: React.DragEvent, type: TEditorButtons) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <AccordionItem value={itemType} className="!py-0 ">
      <AccordionTrigger className="!no-underline">{itemType}</AccordionTrigger>
      <AccordionContent className="flex gap-4">
        {elements
          .filter((element) => element.group === itemType)
          .map((element) => (
            <div

              draggable
              onDragStart={(e) => handleDragState(e, element.id)}
              className="flex flex-col gap-y-1 items-center cursor-grab"
              key={element.id}
            >
              <div
                className={cn(
                  "size-10 bg-muted/70 rounded-sm p-1",
                  element.className
                )}
              >
                {element.icon && (
                  <element.icon size={30} className="text-muted-foreground" />
                )}
                {!element.icon && !!element.withoutIconClassName && (
                  <>
                    <div className={element.withoutIconClassName} />
                    {element.id === "2Col" && (
                      <div className={element.withoutIconClassName} />
                    )}
                  </>
                )}
              </div>
              <span className="text-muted-foreground text-xs">
                {element.label}
              </span>
            </div>
          ))}
      </AccordionContent>
    </AccordionItem>
  );
};

const ComponentsTab = () => {
  return (
    <Accordion
      type="multiple"
      className="w-full mt-4"
      defaultValue={["Layout", "Elements"]}
    >
      <Separator />

      <AccordionItemComponent itemType="Layout" />
      <AccordionItemComponent itemType="Element" />
    </Accordion>
  );
};

export default ComponentsTab;
