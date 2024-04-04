"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";

export type TSelectData = {
  id: string;
  value: string;
  title: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKeys: {
    id: string;
    key: string;
    type: "select" | "input";
    searchData?: TSelectData[];
  }[];
  showPagination? : boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys,
  showPagination,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      {/* Search Input */}
      <div className="flex items-center gap-3 py-4 flex-wrap">
        {searchKeys.map((search) =>
          search.type === "select" ? (
            <Select
              key={search.id}
              onValueChange={(value) => table.getColumn(search.key)?.setFilterValue(value)}
              value={
                (table.getColumn(search.key)?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-full max-w-[210px]">
                <SelectValue placeholder={`Filter ${search.key}...`} />
              </SelectTrigger>
              
              <SelectContent>
                {search.searchData?.map(({ id, value, title }) => (
                  <SelectItem key={id} value={value} >
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              key={search.id}
              placeholder={`Filter By ${search.key}...`}
              value={
                (table.getColumn(search.key)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(search.key)?.setFilterValue(event.target.value)
              }
              className="max-w-[220px]"
            />
          )
        )}
      </div>

      {/* Data table */}
      <div className=" w-full overflow-auto rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap max-w-[400px] truncate"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>}
    </div>
  );
}
