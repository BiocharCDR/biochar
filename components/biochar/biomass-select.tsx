// "use client";

// import { useEffect, useState } from "react";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { createSupabaseBrowser } from "@/lib/supabase/client";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// interface BiomassSelectProps {
//   userId: string;
// }

// type BiomassOption = {
//   value: string;
//   label: string;
//   crop_type: string;
// };

// interface BiomassRecord {
//   id: string;
//   crop_type: string;
//   harvest_date: string;
//   crop_yield: number | null;
//   residue_generated: number | null;
//   residue_storage_location: string | null;
//   status: "stored" | "in_process" | "used";
// }

// export function BiomassSelect({ userId }: BiomassSelectProps) {
//   // Initialize with empty array instead of undefined
//   const [biomassOptions, setBiomassOptions] = useState<BiomassOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const currentValue = searchParams.get("biomass_id");

//   useEffect(() => {
//     async function fetchBiomass() {
//       try {
//         setLoading(true);
//         setError(null);
//         const supabase = createSupabaseBrowser();

//         const { data: biomassRecords, error: supabaseError } = await supabase
//           .from("biomass_production")
//           .select(
//             `
//             id,
//             crop_type,
//             harvest_date,
//             crop_yield,
//             residue_generated,
//             residue_storage_location,
//             status
//           `
//           )
//           .eq("farmer_id", userId)
//           .eq("status", "stored")
//           .order("harvest_date", { ascending: false });

//         if (supabaseError) {
//           throw supabaseError;
//         }

//         if (biomassRecords) {
//           const options = biomassRecords.map((record: BiomassRecord) => ({
//             value: record.id,
//             label: `${record.crop_type} - ${new Date(
//               record.harvest_date
//             ).toLocaleDateString()} (${record.crop_yield || 0}t)`,
//             crop_type: record.crop_type,
//           }));
//           setBiomassOptions(options);
//         } else {
//           setBiomassOptions([]); // Set empty array if no records
//         }
//       } catch (err) {
//         console.error("Error fetching biomass records:", err);
//         setError("Failed to load biomass records");
//         setBiomassOptions([]); // Set empty array on error
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (userId) {
//       fetchBiomass();
//     }
//   }, [userId]);

//   const onSelect = (value: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (value) {
//       params.set("biomass_id", value);
//     } else {
//       params.delete("biomass_id");
//     }
//     router.push(`${pathname}?${params.toString()}`);
//     setOpen(false);
//   };

//   // Find current selection from non-null biomassOptions array
//   const currentSelection = biomassOptions.find(
//     (option) => option.value === currentValue
//   );

//   return (
//     <div className="flex items-center space-x-4">
//       <p className="text-sm font-medium">Filter by Biomass:</p>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             disabled={loading}
//             className="w-[300px] justify-between"
//           >
//             {loading
//               ? "Loading..."
//               : currentSelection
//               ? currentSelection.label
//               : "Select biomass source..."}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[300px] p-0">
//           <Command>
//             <CommandInput placeholder="Search biomass records..." />
//             <CommandEmpty>
//               {error ? error : "No biomass records found."}
//             </CommandEmpty>
//             <CommandGroup>
//               {biomassOptions.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={option.value}
//                   onSelect={() => onSelect(option.value)}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       currentValue === option.value
//                         ? "opacity-100"
//                         : "opacity-0"
//                     )}
//                   />
//                   {option.label}
//                 </CommandItem>
//               ))}
//               {biomassOptions.length > 0 && (
//                 <CommandItem onSelect={() => onSelect("")}>
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       !currentValue ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                   Show all records
//                 </CommandItem>
//               )}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
