export type Profile = {
  full_name: string | null;
};

export type Parcel = {
  id: string;
  farmer_id: string;
  parcel_name: string;
  gps_coordinates: string | null;
  shape_file_url: string | null;
  total_area: number | null;
  cultivable_area: number | null;
  avg_crop_yield: number | null;
  avg_residue_yield: number | null;
  avg_residue_consumption: number | null;
  biochar_facility_distance: number | null;
  storage_facility_distance: number | null;
  available_storage_area: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  verification_status: string | null;
  profiles?: Profile | null;
};
