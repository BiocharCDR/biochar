"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BiomassProductionWithParcelName } from "./types";

export const columns: ColumnDef<BiomassProductionWithParcelName>[] = [
  {
    accessorKey: "crop_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Crop Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("crop_type")}</div>
    ),
  },
  {
    accessorKey: "land_parcels.parcel_name",
    header: "Parcel",
    cell: ({ row }) => row.original.land_parcels?.parcel_name,
  },
  {
    accessorKey: "harvest_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Harvest Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("harvest_date");
      return date ? format(new Date(date as string), "PPP") : "-";
    },
  },
  {
    accessorKey: "crop_yield",
    header: "Crop Yield (t)",
    cell: ({ row }) => {
      const yield_value = row.getValue("crop_yield") as number;
      return yield_value?.toFixed(2) || "-";
    },
  },
  {
    accessorKey: "residue_generated",
    header: "Residue (t)",
    cell: ({ row }) => {
      const residue = row.getValue("residue_generated") as number;
      return residue?.toFixed(2) || "-";
    },
  },
  {
    accessorKey: "quality_grade",
    header: "Quality",
    cell: ({ row }) => {
      const grade = row.getValue("quality_grade") as string;
      return grade || "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "archived"
              ? "secondary"
              : "default"
          }
        >
          {status || "N/A"}
        </Badge>
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
            .from("biomass_production")
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
              <Link href={`/biomass/${record.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/biomass/edit/${record.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteRecord}
              className="text-destructive"
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
