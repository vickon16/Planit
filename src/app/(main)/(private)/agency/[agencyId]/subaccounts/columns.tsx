"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { TSubAccountGetPayload } from "@/lib/types";
import CellActions from "./actions";

export const columns: ColumnDef<TSubAccountGetPayload>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 relative">
            <Image
              src={row.original.subAccountLogo}
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
  {
    accessorKey: "companyEmail",
    header: "Email",
  },
  {
    accessorKey: "goal",
    header: "SubAccount Goal",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      return <div className="truncate ">{row.original.address}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions rowData={row.original} />
  },
];
