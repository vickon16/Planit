"use client";

import { cn, formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { TSubAccountTeamGetPayload } from "@/lib/types";
import CellActions from "./actions";

export const columns: ColumnDef<TSubAccountTeamGetPayload>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 relative flex-none">
            <Image
              src={row.original.user.image}
              fill
              className="rounded-full object-cover"
              alt="avatar image"
            />
          </div>
          <span>{row.original.user.name}</span>
        </div>
      );
    },
  },
  { accessorKey: "email", header: "Email", cell : ({row}) => row.original.user.email },
  {
    accessorKey: "access",
    header: "Access",
    cell: ({ row }) => {
      const isAccess = row.original.access;

      return (
        <div className={cn("p-1.5 w-fit rounded-md text-xs", {
          "bg-emerald-600 text-white" : isAccess,
          "bg-muted" : !isAccess
        })}>
          {isAccess ? "Permitted" : "Not Permitted"}
        </div>
      );
    },
  },
  {
    accessorKey: "totalValue",
    header: "Total Value",
    cell: ({ row }) => (
      <div>
        {formatter(
          row.original.tickets.reduce((sum, ticket) => sum + ticket.value, 0) || 0
        )}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions rowData={row.original.user} />
  },
];
