"use client";

import { TLaneGetPayload, TPipeLineGetPayload } from "@/lib/types";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import PipeLineLane from "./pipeline-lane";
import { Flag } from "lucide-react";
import { useState } from "react";
import { updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import { useRouter } from "next/navigation";

type Props = {
  pipeline: TPipeLineGetPayload;
  subAccountId: string;
};

const PipelineView = ({ pipeline, subAccountId }: Props) => {
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<TLaneGetPayload[]>(pipeline.lanes);

  const onDragEnd = (dropResult: DropResult) => {
    console.log(dropResult);
    const { destination, source, type } = dropResult;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    switch (type) {
      case "lane": {
        const newLanes = allLanes
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, index) => ({ ...lane, order: index }));

        setAllLanes(newLanes);
        updateLanesOrder(newLanes);
        router.refresh()
      }

      case "ticket": {
        const sourceLane = allLanes.find(
          (lane) => lane.id === source.droppableId
        );
        const destinationLane = allLanes.find(
          (lane) => lane.id === destination.droppableId
        );

        if (!sourceLane || !destinationLane) return;

        // drag and drop within the same lane
        if (sourceLane.id === destinationLane.id) {
          sourceLane.tickets = sourceLane.tickets
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, sourceLane.tickets[source.index])
            .map((ticket, index) => ({ ...ticket, order: index }));

          setAllLanes(allLanes);
          updateTicketsOrder(sourceLane.tickets);
        } else {
          // drag and drop between lanes
          const [currentTicket] = sourceLane.tickets.splice(source.index, 1);
          sourceLane.tickets = sourceLane.tickets.map((lane, index) => ({
            ...lane,
            order: index,
          }));

          destinationLane.tickets = destinationLane.tickets.toSpliced(destination.index, 0, {
            ...currentTicket,
            laneId: destinationLane.id,
          }).map((ticket, index) => ({...ticket, order : index}));

          setAllLanes(allLanes);
          updateTicketsOrder([
            ...sourceLane.tickets,
            ...destinationLane.tickets
          ])
        }

        router.refresh();
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="lanes"
        type="lane"
        direction="horizontal"
        key="lanes"
      >
        {(provided) => (
          <section className="bg-[url('/assets/rain.svg')] rounded-xl px-2 animate-automation-zoom-in">
            <div
              className="flex item-center gap-x-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Array.isArray(allLanes) &&
                allLanes.length > 0 &&
                allLanes
                  .sort((a, b) => a.order - b.order)
                  .map((lane, index) => (
                    <PipeLineLane
                      index={index}
                      key={lane.id}
                      subAccountId={subAccountId}
                      lane={lane}
                    />
                  ))}
            </div>
            {provided.placeholder}
          </section>
        )}
      </Droppable>

      {!Array.isArray(allLanes) ||
        (allLanes.length === 0 && (
          <div className="flex items-center justify-center text-center gap-y-2 w-full flex-col">
            <Flag size={40} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">...No lanes ...</p>
          </div>
        ))}
    </DragDropContext>
  );
};

export default PipelineView;
