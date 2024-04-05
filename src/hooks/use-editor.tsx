import { FunnelPage } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TDeviceTypes = "Desktop" | "Mobile" | "Tablet";
export type TEditorButtons =
  | "text"
  | "container"
  | "section"
  | "contactForm"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | "3Col"
  | null;

export type TEditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: TEditorButtons;
  content:
    | TEditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

export type TEditor = {
  elements: TEditorElement[];
  selectedElement: TEditorElement;
  liveMode: boolean;
  device: TDeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
  subAccountId: string;
};

export type THistory = {
  historyArray: TEditor[];
  currentIndex: number;
};

const initialEditorState: TEditor = {
  elements: [
    {
      content: [],
      id: "",
      name: "",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
  subAccountId: "",
};

const initialHistoryState: THistory = {
  historyArray: [initialEditorState],
  currentIndex: 0,
};

type TEditorStore = {
  editor: TEditor;
  history: THistory;
  initFunnel: (funnelPage: FunnelPage, subAccountId: string) => void;

  // Crud Element
  addElement : (element : TEditorElement, toElementId : string) => void;
  deleteElement: (element: TEditorElement) => void;

  undoAction: () => void;
  redoAction: () => void;
  togglePreviewMode: (mode?: boolean) => void;
  toggleLiveMode: (mode?: boolean) => void;
  changeDeviceType: (deviceType: TDeviceTypes) => void;
  changeClickedElement: (element: TEditorElement) => void;
};

const manageHistory = (get : () => TEditorStore, set : any, newState : TEditor) => {
  const newHistoryState = [
    ...get().history.historyArray.slice(
      0,
      get().history.currentIndex + 1
    ),
    newState,
  ];

  set({
    editor: newState,
    history: {
      ...get().history,
      historyArray: newHistoryState,
      currentIndex: newHistoryState.length - 1,
    },
  });
}

const useEditor = create(
  persist<TEditorStore>(
    (set, get) => ({
      editor: initialEditorState,
      history: initialHistoryState,
      editorAccountInfo: null,
      initFunnel: (funnelPage, subAccountId) => {
        const prevSubAccountId = get().editor.subAccountId;
        const prevFunnelPageId = get().editor.funnelPageId;

        if (
          prevFunnelPageId === funnelPage.id &&
          prevSubAccountId === subAccountId
        )
          return;

        const newEditorState: TEditor = {
          ...get().editor,
          subAccountId,
          funnelPageId: funnelPage.id,
          elements: JSON.parse(funnelPage.elements),
        };

        set({
          editor: newEditorState,
          history: {
            historyArray: [newEditorState],
            currentIndex: 0,
          },
        });
      },

      addElement: (element, toElementId) => {
        // the "toElementId should already be in the editor";
        const newElementsArray = get().editor.elements.map(singleElement => {
          if (singleElement.id === toElementId && Array.isArray(singleElement.content)) {
            return {
              ...singleElement,
              content: [...singleElement.content, element]
            }
          }
          return singleElement;
        })
 
        const newEditor = { ...get().editor, elements: newElementsArray };
        manageHistory(get, set, newEditor)
      },

      deleteElement: (element) => {
        console.log(element.id)
        const newElementsArray = get().editor.elements.filter(
          (e) => e.id !== element.id
        );

        console.log("hey");

        const newEditor = { ...get().editor, elements: newElementsArray };
        manageHistory(get, set, newEditor)
      },

      undoAction: () => {
        const history = get().history;

        if (history.currentIndex > 0) {
          const prevIndex = history.currentIndex - 1;
          const prevEditorState = history.historyArray[prevIndex];
          set({
            editor: prevEditorState,
            history: { ...history, currentIndex: prevIndex },
          });
        }
      },

      redoAction: () => {
        const history = get().history;

        if (history.currentIndex < history.historyArray.length - 1) {
          const nextIndex = history.currentIndex + 1;
          const nextEditorState = history.historyArray[nextIndex];
          set({
            editor: nextEditorState,
            history: { ...history, currentIndex: nextIndex },
          });
        }
      },

      togglePreviewMode: (mode) =>
        set({
          editor: {
            ...get().editor,
            previewMode: mode || !get().editor.previewMode,
          },
        }),
      toggleLiveMode: (mode) =>
        set({
          editor: { ...get().editor, liveMode: mode || !get().editor.liveMode },
        }),
      changeDeviceType: (deviceType) =>
        set({ editor: { ...get().editor, device: deviceType } }),

      changeClickedElement: (element) => {
        if (!element) return null;
        const selectedElement = get().editor.selectedElement;
        if (selectedElement.id === element.id) return null;

        const newEditor = { ...get().editor, selectedElement: element };
        manageHistory(get, set, newEditor)
      },
    }),

    {
      name: "editor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditor;
