"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useEditor from "@/hooks/use-editor";
import { cn, zPriority } from "@/lib/utils";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import MediaBucketTab from "./tabs/media-bucket-tab";
// import SettingsTab from './tabs/settings-tab'
// import MediaBucketTab from './tabs/media-bucket-tab'
import ComponentsTab from "./tabs/component-tab";

type Props = {
  subAccountId: string;
};

const FunnelEditorSidebar = ({ subAccountId }: Props) => {
  const { editor } = useEditor();

  return (
    <Sheet open={true} modal={false}>
      <SheetContent
        showX={false}
        side="right"
        className={cn(
          "mt-[95px] w-[360px] shadow-none p-0 bg-background transition-all overflow-hidden",
          zPriority.pr4,
          { hidden: editor.previewMode }
        )}
      >
        <Tabs
          className="w-full h-full flex items-start justify-between overflow-hidden"
          defaultValue="Settings"
        >
          <div className="grid gap-4 h-full overflow-auto">
            <TabsContent value="Settings" className="p-3 text-left">
              <SheetHeader>
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
              </SheetHeader>
              {/* <SettingsTab /> */}
            </TabsContent>

            <TabsContent value="Components" className="p-3 text-left">
              <SheetHeader>
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>
                  You can drag and drop components on the canvas
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>

            <TabsContent value="Media" className="p-3 text-left">
              <SheetHeader>
                <SheetTitle>Media Bucket</SheetTitle>
                <SheetDescription>
                  Make use of your media buckets here.
                </SheetDescription>
              </SheetHeader>
              <MediaBucketTab subAccountId={subAccountId} />
            </TabsContent>

            <TabsContent value="Layers" className="p-3 text-left">
              <SheetHeader>
                <SheetTitle>Layers</SheetTitle>
                <SheetDescription>
                  This functionality is not yet available.
                </SheetDescription>
              </SheetHeader>
              {/* Layers go here */}
            </TabsContent>
          </div>

          <TabsList className="flex items-center flex-col justify-start w-full max-w-[60px] bg-transparent h-full border-l gap-4 ">
            <TabsTrigger
              value="Settings"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <SettingsIcon />
            </TabsTrigger>
            <TabsTrigger
              value="Components"
              className="data-[state=active]:bg-muted w-10 h-10 p-0"
            >
              <Plus />
            </TabsTrigger>
            <TabsTrigger
              value="Media"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <Database />
            </TabsTrigger>

            <TabsTrigger
              value="Layers"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <SquareStackIcon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default FunnelEditorSidebar;
