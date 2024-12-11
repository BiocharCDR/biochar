"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, MapPin, MoreHorizontal, Phone, User } from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface FarmersClientProps {
  data: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    created_at: string;
    land_parcels: { id: string }[] | null;
  }[];
}

export function FarmersClient({ data }: FarmersClientProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<FarmersClientProps["data"][0]>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{row.getValue("full_name") || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{row.getValue("phone_number") || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{row.getValue("address") || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("created_at")), "PP")}</div>
      ),
    },
    {
      accessorKey: "land_parcels",
      header: "Parcels",
      cell: ({ row }) => {
        const parcels = row.original.land_parcels;
        return <div>{parcels?.length || 0} parcels</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const farmer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/farmers/${farmer.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/farmers/${farmer.id}/parcels`)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                View Parcels
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("full_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

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
                  No farmers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
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
      </div>
    </div>
  );
} 