"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Minus, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteItemAction } from "./_actions/delete-item-action";
import { incrementItemAction } from "./_actions/increment-item-action";
import { State, decrementItemAction } from "./_actions/decrement-item-action";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";

export type Item = {
  id: number;
  name: string;
  quantity: number;
};

export function ItemsTable({ items }: { items: Item[] }) {
  const { toast } = useToast();
  const [decrementState, decrementAction] = useFormState(decrementItemAction, {
    showToast: false,
  });

  const [incrementState, incrementAction] = useFormState(incrementItemAction, {
    showToast: false,
  });

  const [deleteState, deleteAction] = useFormState(deleteItemAction, {
    showToast: false,
  });

  useEffect(() => {
    if (deleteState.showToast)
      toast({
        title: "Item Removed",
        description: "This item was removed from your pantry",
      });
  }, [toast, deleteState]);

  useEffect(() => {
    if (decrementState.showToast)
      toast({
        title: "Item Moved",
        description: "We moved your item to the out of tab",
      });
  }, [toast, decrementState]);

  useEffect(() => {
    if (incrementState.showToast)
      toast({
        title: "Item Moved",
        description: "We moved your item to the in stock tab",
      });
  }, [toast, incrementState]);

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          return (
            <form className="flex gap-2 items-center">
              <input type="hidden" name="itemId" value={row.original.id} />
              <button
                className="disabled:text-gray-600"
                disabled={row.original.quantity === 0}
                formAction={decrementAction}
              >
                <Minus />
              </button>
              {row.original.quantity}
              <button formAction={incrementAction}>
                <Plus />
              </button>
            </form>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <form action={deleteAction}>
                    <input
                      type="hidden"
                      value={row.original.id}
                      name="itemId"
                    />
                    <button>Remove</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [incrementAction, decrementAction, deleteAction]
  );

  const table = useReactTable({
    data: items,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: [{ id: "name", desc: false }],
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
    </div>
  );
}
