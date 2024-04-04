"use client";

import useEditor, { TDeviceTypes } from "@/hooks/use-editor";
import { appLinks } from "@/lib/appLinks";
import { cn } from "@/lib/utils";
import { FunnelPage } from "@prisma/client";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FocusEventHandler, useEffect } from "react";
import { toast } from "sonner";
import { updateFunnelPage } from "@/lib/queries";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Props = {
  funnelPage: FunnelPage;
  subAccountId: string;
};

const FunnelEditorNavigation = ({ funnelPage, subAccountId }: Props) => {
  const router = useRouter();
  const {
    editor,
    history,
    initFunnel,
    toggleLiveMode,
    togglePreviewMode,
    changeDeviceType,
    undoAction,
    redoAction,
  } = useEditor();

  useEffect(() => {
    if (!!funnelPage && !!subAccountId) initFunnel(funnelPage, subAccountId);
  }, [funnelPage, subAccountId, initFunnel]);

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.value === funnelPage.name) return;

    if (event.target.value) {
      await updateFunnelPage(funnelPage.id, {
        ...funnelPage,
        name: event.target.value,
      });

      toast.success("Success", {
        description: "Saved Funnel Page title",
      });
      router.refresh();
    } else {
      toast.error("Oppse! You need to have a title!");
      event.target.value = funnelPage.name;
    }
  };

  const handlePreviewClick = () => {
    toggleLiveMode();
    togglePreviewMode();
  };

  const handleSave = async () => {
    const elements = JSON.stringify(editor.elements);
    try {
      await updateFunnelPage(funnelPage.id, {
        ...funnelPage,
        elements,
      });

      toast.success("Success", {
        description: "Saved Editor",
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Oppse! Could not save editor");
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={cn(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
          { "!h-0 !p-0 !overflow-hidden": editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link
            className={buttonVariants({
              variant: "link",
              className: "flex items-center gap-x-1",
            })}
            href={`${appLinks.subAccount}/${subAccountId}/funnels/${funnelPage.funnelId}`}
          >
            <ArrowLeftCircle /> Back
          </Link>

          <div className="flex flex-col w-full gap-y-1">
            <Input
              defaultValue={funnelPage.name}
              className="border-none h-7 m-0 p-0 !rounded-none !text-clampMd font-semibold"
              onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              Path: /{funnelPage.pathName}
            </span>
          </div>
        </aside>

        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={editor.device}
            onValueChange={(value) => changeDeviceType(value as TDeviceTypes)}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TabsTrigger
                  value="Desktop"
                  className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  asChild
                >
                  <TooltipTrigger>
                    <Laptop />
                  </TooltipTrigger>
                </TabsTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TabsTrigger
                  value="Tablet"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  asChild
                >
                  <TooltipTrigger>
                    <Tablet />
                  </TooltipTrigger>
                </TabsTrigger>
                <TooltipContent>Tablet</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TabsTrigger
                  value="Mobile"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  asChild
                >
                  <TooltipTrigger>
                    <Smartphone />
                  </TooltipTrigger>
                </TabsTrigger>
                <TooltipContent>Mobile</TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>

        <aside className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handlePreviewClick}
              >
                <EyeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={history.currentIndex <= 0}
                onClick={undoAction}
                variant={"ghost"}
                size={"icon"}
                className="hover:bg-slate-800"
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={
                  history.currentIndex >= history.historyArray.length - 1
                }
                onClick={redoAction}
                variant={"ghost"}
                size={"icon"}
                className="hover:bg-slate-800 mr-4"
              >
                <Redo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4 text-sm">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last updated {funnelPage.updatedAt.toLocaleDateString()}
            </span>
          </div>

          <Button onClick={handleSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
