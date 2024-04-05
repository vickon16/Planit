"use client";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { v4 } from "uuid";
import Recursive from "./recursive";
import { Trash } from "lucide-react";
import useEditor, { TEditorButtons, TEditorElement } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import { defaultStyles } from "@/lib/constants";

type Props = { element: TEditorElement };

const Container = ({ element }: Props) => {
  const { editor, changeClickedElement, deleteElement, addElement } =
    useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData(
      "componentType"
    ) as TEditorButtons;

    switch (componentType) {
      // case 'text':
      // dispatch({
      //   type: 'ADD_ELEMENT',
      //   payload: {
      //     containerId: id,
      //     elementDetails: {
      //       content: { innerText: 'Text Element' },
      //       id: v4(),
      //       name: 'Text',
      //       styles: {
      //         color: 'black',
      //         ...defaultStyles,
      //       },
      //       type: 'text',
      //     },
      //   },
      // })
      // break
      // case 'link':
      //   dispatch({
      //     type: 'ADD_ELEMENT',
      //     payload: {
      //       containerId: id,
      //       elementDetails: {
      //         content: {
      //           innerText: 'Link Element',
      //           href: '#',
      //         },
      //         id: v4(),
      //         name: 'Link',
      //         styles: {
      //           color: 'black',
      //           ...defaultStyles,
      //         },
      //         type: 'link',
      //       },
      //     },
      //   })
      //   break

      // case 'video':
      // dispatch({
      //   type: 'ADD_ELEMENT',
      //   payload: {
      //     containerId: id,
      //     elementDetails: {
      //       content: {
      //         src: 'https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1',
      //       },
      //       id: v4(),
      //       name: 'Video',
      //       styles: {},
      //       type: 'video',
      //     },
      //   },
      // })
      // break
      case "container":
        addElement(
          {
            content: [],
            id: v4(),
            name: "Container",
            styles: { ...defaultStyles },
            type: "container",
          },
          element.id
        );
        break;
      // case 'contactForm':
      //   dispatch({
      //     type: 'ADD_ELEMENT',
      //     payload: {
      //       containerId: id,
      //       elementDetails: {
      //         content: [],
      //         id: v4(),
      //         name: 'Contact Form',
      //         styles: {},
      //         type: 'contactForm',
      //       },
      //     },
      //   })
      //   break
      // case 'paymentForm':
      // dispatch({
      //   type: 'ADD_ELEMENT',
      //   payload: {
      //     containerId: id,
      //     elementDetails: {
      //       content: [],
      //       id: v4(),
      //       name: 'Contact Form',
      //       styles: {},
      //       type: 'paymentForm',
      //     },
      //   },
      // })
      // break
      // case "2Col":
        // dispatch({
        //   type: "ADD_ELEMENT",
        //   payload: {
        //     containerId: id,
        //     elementDetails: {
        //       content: [
        //         {
        //           content: [],
        //           id: v4(),
        //           name: "Container",
        //           styles: { ...defaultStyles, width: "100%" },
        //           type: "container",
        //         },
        //         {
        //           content: [],
        //           id: v4(),
        //           name: "Container",
        //           styles: { ...defaultStyles, width: "100%" },
        //           type: "container",
        //         },
        //       ],
        //       id: v4(),
        //       name: "Two Columns",
        //       styles: { ...defaultStyles, display: "flex" },
        //       type: "2Col",
        //     },
        //   },
        // });
        break;
    }
  };

  return (
    <div
      style={element.styles}
      className={cn("relative p-4 transition-all group", {
        "max-w-full w-full":
          element.type === "container" || element.type === "2Col",
        "h-fit": element.type === "container",
        "h-full": element.type === "__body",
        "overflow-auto": element.type === "__body",
        "flex flex-col md:!flex-row": element.type === "2Col",
        "!border-primary/50":
          editor.selectedElement.id === element.id &&
          !editor.liveMode &&
          editor.selectedElement.type !== "__body",
        "!border-primary !border-4":
          editor.selectedElement.id === element.id &&
          !editor.liveMode &&
          editor.selectedElement.type === "__body",
        "!border-solid":
          editor.selectedElement.id === element.id && !editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, element.id)}
      onDragOver={(e) => e.preventDefault()}
      // draggable={element.type !== "__body"}
      onClick={(e) => {
        e.stopPropagation();
        changeClickedElement(element);
      }}
    >
      {editor.selectedElement.id === element.id && !editor.liveMode && (
        <Badge className={cn("absolute top-0 left-0 rounded-none px-1 py-0 text-[9px]")}>
          {element.name}
        </Badge>
      )}

      {Array.isArray(element.content) &&
        element.content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}

      {editor.selectedElement.id === element.id &&
        !editor.liveMode &&
        editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary p-1 cursor-pointer text-[10px] -top-[10px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={15} onClick={() => deleteElement(element)} />
          </div>
        )}
    </div>
  );
};

export default Container;
