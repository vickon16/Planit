"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./actions";
import { TContactGetPayload } from "@/lib/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatter } from "@/lib/utils";

export const columns: ColumnDef<TContactGetPayload>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">
        <Avatar>
          <AvatarImage alt="@shadcn" />
          <AvatarFallback className="bg-primary text-white">
            {row.original.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.name}</span>
      </div>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const ticket = row.original.tickets;
      if (!Array.isArray(ticket) || ticket.length === 0) {
        return <Badge variant={"destructive"}>Inactive</Badge>;
      } else {
        return <Badge className="bg-emerald-700">Active</Badge>;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <span>{format(row.original.createdAt, "MM/dd/yyyy")}</span>
    ),
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
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];
