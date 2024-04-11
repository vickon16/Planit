import { manageHistory } from "@/lib/utils";
import { FunnelPage } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TDeviceTypes = "Desktop" | "Mobile" | "Tablet";
export type TEditorButtons =
  | "text"
  | "button"
  | "container"
  | "section"
  | "contactForm"
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
  href?: string;
  innerText?: string;
  src?: string;
  content: TEditorElement[];
};

export type TEditor = {
  elementBody: TEditorElement;
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
  elementBody: {
    content: [],
    id: "",
    name: "",
    styles: {},
    type: "__body",
  },
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

export type TEditorStore = {
  editor: TEditor;
  history: THistory;
  initFunnel: (funnelPage: FunnelPage, subAccountId: string) => void;

  // Crud Element
  addElement: (element: TEditorElement, toElementId: string) => void;
  updateElement: (element: TEditorElement) => void;
  deleteElement: (elementId: string) => void;

  undoAction: () => void;
  redoAction: () => void;
  togglePreviewMode: (mode?: boolean) => void;
  toggleLiveMode: (mode?: boolean) => void;
  changeDeviceType: (deviceType: TDeviceTypes) => void;
  changeClickedElement: (element: TEditorElement) => void;

  resetStore: (funnelPageId : string, subAccountId : string) => void;
};

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
          elementBody: JSON.parse(funnelPage.elements),
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
        let newEditor: TEditor;

        if (toElementId === "__body") {
          newEditor = {
            ...get().editor,
            elementBody: {
              ...get().editor.elementBody,
              content: [...get().editor.elementBody.content, element],
            },
          };
        } else {
          const recursiveFunction = (
            elementContent: TEditorElement[]
          ): TEditorElement[] => {
            return elementContent.map((singleElement) => {
              if (singleElement.id === toElementId) {
                return {
                  ...singleElement,
                  content: [...singleElement.content, element],
                };
              } else if (singleElement.content.length > 0) {
                return {
                  ...singleElement,
                  content: recursiveFunction(singleElement.content),
                };
              }
              return singleElement;
            });
          };

          newEditor = {
            ...get().editor,
            elementBody: {
              ...get().editor.elementBody,
              content: recursiveFunction(get().editor.elementBody.content),
            },
          };
        }

        manageHistory(get, set, newEditor);
      },

      updateElement: (element) => {
        // the "toElementId should already be in the editor";
        let newEditor: TEditor;

        const recursiveFunction = (
          elementContent: TEditorElement[]
        ): TEditorElement[] => {
          return elementContent.map((singleElement) => {
            if (singleElement.id === element.id) {
              return { ...singleElement, ...element };
            } else if (singleElement.content.length > 0) {
              return {
                ...singleElement,
                content: recursiveFunction(singleElement.content),
              };
            }
            return singleElement;
          });
        };

        newEditor = {
          ...get().editor,
          elementBody: {
            ...get().editor.elementBody,
            content: recursiveFunction(get().editor.elementBody.content),
          },
          selectedElement: element,
        };

        manageHistory(get, set, newEditor);
      },

      deleteElement: (elementId) => {
        const recursiveFunction = (
          elementContent: TEditorElement[]
        ): TEditorElement[] => {
          return elementContent.filter((singleElement) => {
            if (singleElement.id === elementId) return false;
            else if (singleElement.content.length > 0) {
              singleElement.content = recursiveFunction(singleElement.content);
            }
            return true;
          });
        };

        const newEditor: TEditor = {
          ...get().editor,
          elementBody: {
            ...get().editor.elementBody,
            content: recursiveFunction(get().editor.elementBody.content),
          },
        };

        manageHistory(get, set, newEditor);
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

        set({
          editor: { ...get().editor, selectedElement: element },
        });
      },

      resetStore: (funnelPageId, subAccountId) => {
        set({
          editor: {
            ...initialEditorState,
            funnelPageId: funnelPageId,
            subAccountId,
          },
          history: {
            historyArray: [initialEditorState],
            currentIndex: 0,
          },
        });
      },
    }),

    {
      name: "editor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditor;
