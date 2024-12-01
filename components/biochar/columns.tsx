"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";

import { BiocharProductionWithRelations, PRODUCTION_STATUS } from "./types";

export const columns: ColumnDef<BiocharProductionWithRelations>[] = [
  {
    accessorKey: "batch_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Batch Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("batch_number")}</div>
    ),
  },
  {
    accessorKey: "biomass.crop_type",
    header: "Biomass Source",
    cell: ({ row }) => row.original.biomass?.crop_type || "Not specified",
  },
  {
    accessorKey: "production_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Production Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue("production_date")), "PPP");
    },
  },
  {
    accessorKey: "biomass_weight",
    header: "Input (kg)",
    cell: ({ row }) => {
      const value = row.getValue("biomass_weight") as number;
      return value?.toFixed(2) || "-";
    },
  },
  {
    accessorKey: "biochar_weight",
    header: "Output (kg)",
    cell: ({ row }) => {
      const value = row.getValue("biochar_weight") as number;
      return value?.toFixed(2) || "-";
    },
  },
  {
    accessorKey: "yield_percentage",
    header: "Yield %",
    cell: ({ row }) => {
      const value = row.getValue("yield_percentage") as number;
      return value ? `${value.toFixed(1)}%` : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusVariants;
      return (
        <Badge variant={statusVariants[status]}>{formatStatus(status)}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const record = row.original;
      const supabase = createSupabaseBrowser();

      async function deleteRecord() {
        try {
          const { error } = await supabase
            .from("biochar_production")
            .delete()
            .eq("id", record.id);

          if (error) throw error;
          toast.success("Record deleted successfully");
          router.refresh();
        } catch (error) {
          console.error("Error deleting record:", error);
          toast.error("Failed to delete record");
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/biochar/${record.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/biochar/edit/${record.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteRecord}
              className="text-destructive"
              disabled={record.status === PRODUCTION_STATUS.COMPLETED}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Utility functions for status display
const statusVariants = {
  [PRODUCTION_STATUS.IN_PROGRESS]: "warning",
  [PRODUCTION_STATUS.COMPLETED]: "default",
  [PRODUCTION_STATUS.FAILED]: "destructive",
} as const;

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
