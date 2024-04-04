import { type ClassValue, clsx } from "clsx";
import { DraggableProvided } from "@hello-pangea/dnd";
import { twMerge } from "tailwind-merge";

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
