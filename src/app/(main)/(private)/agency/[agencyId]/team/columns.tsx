"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Prisma } from "@prisma/client";
import CellActions from "./actions";
import { TUserGetPayload } from "@/lib/types";

export const columns: ColumnDef<TUserGetPayload>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 relative flex-none">
            <Image
              src={row.original.image}
              fill
              className="rounded-full object-cover"
              alt="avatar image"
            />
          </div>
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "access",
    header: "Access",
    cell: ({ row }) => {
      const isAccess = row.original.agencyTeam?.access;

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
    id: "actions",
    cell: ({ row }) => <CellActions rowData={row.original} />
  },
];
