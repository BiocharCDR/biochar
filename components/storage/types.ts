import { Tables } from "@/supabase/schema";

export type StorageWithBiochar = Tables<"biochar_storage"> & {
  biochar: Pick<
    Tables<"biochar_production">,
    "batch_number" | "biochar_weight" | "production_date" | "farmer_id"
  >;
};

export type BiocharApplication = Tables<"biochar_application"> & {
  parcel: Pick<Tables<"land_parcels">, "parcel_name">;
};

export interface StorageDetailHeaderProps {
  storage: StorageWithBiochar;
}

export interface StorageInfoProps {
  storage: StorageWithBiochar;
}

export interface ApplicationHistoryProps {
  applications: BiocharApplication[];
}
