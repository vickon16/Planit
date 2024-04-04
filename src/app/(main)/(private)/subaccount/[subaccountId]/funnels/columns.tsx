"use client";

import { Badge } from "@/components/ui/badge";
import { appLinks } from "@/lib/appLinks";
import { TFunnelGetPayload } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<TFunnelGetPayload>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          className="flex gap-2 items-center"
          href={`${appLinks.subAccount}/${row.original.subAccountId}/funnels/${row.original.id}`}
        >
          {row.getValue("name")}
          <ExternalLink size={15} />
        </Link>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = `${row.original.updatedAt.toDateString()} ${row.original.updatedAt.toLocaleTimeString()}`;
      return <span className="text-muted-foreground">{date}</span>;
    },
  },
  {
    accessorKey: 'published',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.published
      return status ? (
        <Badge variant={'default'}>Live - {row.original.subDomainName}</Badge>
      ) : (
        <Badge variant={'secondary'}>Draft</Badge>
      )
    },
  }
];
