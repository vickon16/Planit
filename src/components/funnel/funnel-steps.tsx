"use client";

import useDisplayModal from "@/hooks/use-display-modal";
import { TFunnelGetPayload } from "@/lib/types";
import { FunnelPage } from "@prisma/client";
import { Check, ExternalLink, LucideEdit, Plus } from "lucide-react";
import { useState } from "react";
import FunnelStepsCard from "./funnel-steps-card";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import CustomModal from "../global/custom-modal";
import CreateFunnelPage from "../forms/create-funnel-page";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { updateFunnelPagesOrder } from "@/lib/queries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { appLinks } from "@/lib/appLinks";
import FunnelPagePlaceholder from "../icons/funnel-page-placeholder";

type Props = {
  funnel: TFunnelGetPayload;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = ({ funnel, funnelId, pages }: Props) => {
  const { setOpen } = useDisplayModal();
  const [allPages, setAllPages] = useState(pages);
  const [clickedPage, setClickedPage] = useState<FunnelPage>(allPages[0]);
  const router = useRouter();

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newPagesOrder = allPages
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, allPages[source.index])
      .map((page, index) => ({ ...page, order: index }));

    setAllPages(newPagesOrder);
    updateFunnelPagesOrder(newPagesOrder);
    router.refresh();
  };

  return (
    <div className="flex border-[1px] lg:!flex-row flex-col ">
      <aside className="flex-[0.3] bg-background p-6 flex flex-col gap-y-8">
        <div className="flex gap-2 items-center justify-between flex-wrap">
          <Heading heading="Funnel Steps" headingSize="sm" />
          <Button
            variant="secondary"
            icon={<Plus size={14} />}
            onClick={() => {
              setOpen(
                <CustomModal
                  title="Create Funnel Pages"
                  subheading="Funnel Pages allow you to create step by step processes for customers to follow"
                  className="max-w-[700px] h-fit"
                >
                  <CreateFunnelPage
                    funnelId={funnelId}
                    data={{ order: allPages.length }}
                  />
                </CustomModal>
              );
            }}
          >
            Create
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="funnel-pages"
            direction="vertical"
            key="funnel-pages"
          >
            {(provided) => (
              <div
                className="space-y-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Array.isArray(allPages) && allPages.length > 0 ? (
                  allPages
                    .sort((a, b) => a.order - b.order)
                    .map((page, index) => (
                      <div
                        className="relative"
                        key={page.id}
                        onClick={() => setClickedPage(page)}
                      >
                        <FunnelStepsCard
                          funnelPage={page}
                          index={index}
                          activePage={page.id === clickedPage.id}
                        />
                      </div>
                    ))
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    ...No Pages...
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </aside>

      <aside className="flex-[0.7] bg-card p-4 ">
        {Array.isArray(allPages) && allPages.length > 0 ? (
          <div className="h-full flex justify-between flex-col gap-4">
            <Heading heading={clickedPage.name} headingSize="md" />

            <div className="flex flex-col gap-4">
                <div className="border rounded-lg sm:w-80 w-full overflow-clip">
                  <Link
                    href={`${appLinks.editor}?subAccountId=${funnel.subAccountId}&funnelPageId=${clickedPage.id}`}
                    className="relative group"
                  >
                    <div className="cursor-pointer group-hover:opacity-30 w-full">
                      <FunnelPagePlaceholder />
                    </div>
                    
                    <LucideEdit
                      size={40}
                      className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                    />
                  </Link>

                  <Link
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage.pathName}`}
                    className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <ExternalLink size={15} />
                    <div className="w-64 overflow-hidden overflow-ellipsis ">
                      {process.env.NEXT_PUBLIC_SCHEME}
                      {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                      {clickedPage.pathName}
                    </div>
                  </Link>
                </div>

                <CreateFunnelPage
                  data={clickedPage}
                  funnelId={funnelId}
                />
              </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            ...Create a page to view page settings...
          </div>
        )}
      </aside>
    </div>
  );
};

export default FunnelSteps;
