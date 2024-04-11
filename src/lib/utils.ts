import { type ClassValue, clsx } from "clsx";
import { DraggableProvided } from "@hello-pangea/dnd";
import { twMerge } from "tailwind-merge";
import {
  TEditor,
  TEditorButtons,
  TEditorElement,
  TEditorStore,
} from "@/hooks/use-editor";
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zPriority = {
  pr_1: "-z-[50]",
  pr0: "z-0",
  pr1: "z-[50]",
  pr2: "z-[100]",
  pr3: "z-[150]",
  pr4: "z-[200]",
  pr5: "z-[250]",
  pr6: "z-[300]",
};

export const queryKeys = {
  user: "user",
  session: "session",
  invitation: "invitation",
  subscriptionPlan: "subscription-plan",
  connectToPlanit: "connect-to-planit",
  media: "media",
  contact: "contact",
  pipeline: "pipeline",
  lane: "lane",
  ticket: "ticket",
  tag: "tag",
  subAccountTeam: "subAccountTeam",
};

export const formatter = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

interface AnyObject {
  [key: string]: any;
}

export const uniqueObjects = <T extends AnyObject>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr
    .filter((obj) => {
      const strObj = JSON.stringify(obj);
      if (!seen.has(strObj)) {
        seen.add(strObj);
        return true;
      }
      return false;
    })
    .map((obj) => JSON.parse(JSON.stringify(obj)));
};

export const snapshotDragging = (
  provided: DraggableProvided,
  x: number,
  y: number
) => {
  const offset = { x, y };
  //@ts-ignore
  provided.draggableProps.style = {
    ...provided.draggableProps.style,
    //@ts-ignore
    top: provided.draggableProps.style?.top - offset.y,
    //@ts-ignore
    left: provided.draggableProps.style?.left - offset.x,
  };
};

export const manageHistory = (
  get: () => TEditorStore,
  set: (
    partial:
      | TEditorStore
      | Partial<TEditorStore>
      | ((state: TEditorStore) => TEditorStore | Partial<TEditorStore>),
    replace?: boolean | undefined
  ) => void,
  newState: TEditor
) => {
  const history = get().history;
  const newHistoryState = [
    ...history.historyArray.slice(0, history.currentIndex + 1),
    newState,
  ];

  set({
    editor: newState,
    history: {
      ...history,
      historyArray: newHistoryState,
      currentIndex: newHistoryState.length - 1,
    },
  });

  if (history.historyArray.length > 0 && history.currentIndex >= 20) {
    const newHistoryArray = history.historyArray.slice(1);

    set({
      history: {
        ...history,
        historyArray: newHistoryArray,
        currentIndex: newHistoryArray.length - 1,
      },
    });
  }
};

export const handleDropOnContainerElement = (
  e: React.DragEvent,
  addElement: (element: TEditorElement, toElementId: string) => void,
  elementId: string
) => {
  e.stopPropagation();
  const componentType = e.dataTransfer.getData(
    "componentType"
  ) as TEditorButtons;

  switch (componentType) {
    case "text":
      addElement(
        {
          content: [],
          id: v4(),
          name: "Text",
          styles: { color: "black", ...defaultStyles },
          type: "text",
          innerText: "Text Element",
        },
        elementId
      );
      break;
    case "button":
      addElement(
        {
          content: [],
          id: v4(),
          name: "Button",
          styles: { ...defaultStyles },
          type: "button",
          innerText: "Button Element",
        },
        elementId
      );
      break;
    case "link":
      addElement(
        {
          content: [],
          id: v4(),
          name: "Link",
          styles: { color: "black", ...defaultStyles },
          type: "link",
          innerText: "Link Element",
          href: "#",
        },
        elementId
      );
      break;

      case 'video':
      addElement(
        {
          content: [],
         id: v4(),
          name: 'Video',
          styles: {},
          type: 'video',
          src : "https://www.youtube.com/embed/ScMzIvxBSi4"
        },
        elementId
      );
    break
      case 'image':
      addElement(
        {
          content: [],
         id: v4(),
          name: 'Image',
          styles: {},
          type: 'image',
          src : "https://utfs.io/f/bdf296d9-0389-4591-a5a5-c60a346c504d-196vig.jpg"
        },
        elementId
      );
    break
    case "container":
      addElement(
        {
          content: [],
          id: v4(),
          name: "Container",
          styles: { ...defaultStyles },
          type: "container",
        },
        elementId
      );
      break;
    case 'contactForm':
      addElement(
        {
          content: [],
          id: v4(),
          name: 'Contact Form',
          styles: {},
          type: 'contactForm',
        },
        elementId
      );
      break
    case "2Col":
      addElement(
        {
          content: [
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
            },
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
            },
          ],
          id: v4(),
          name: "Two Columns",
          styles: { ...defaultStyles, display: "flex" },
          type: "2Col",
        },
        elementId
      );
      break;
    case "3Col":
      addElement(
        {
          content: [
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
            },
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
            },
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
            },
          ],
          id: v4(),
          name: "Three Columns",
          styles: { ...defaultStyles, display: "flex"},
          type: "3Col",
        },
        elementId
      );
      break;
  }
};
