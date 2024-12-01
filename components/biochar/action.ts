"use server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function getBiocharProductionById(id: string) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("biochar_production")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching biochar production:", error);
    return null;
  }

  return data;
}

export async function getBiocharStorageByBiocharId(biocharId: string) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("biochar_storage")
    .select("*")
    .eq("biochar_id", biocharId)
    .single();

  if (error) {
    console.error("Error fetching biochar storage:", error);
    return null;
  }

  return data;
}

export async function getBiomassRecords() {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("biomass_production")
    .select("*")
    .order("harvest_date", { ascending: false });

  if (error) {
    console.error("Error fetching biomass records:", error);
    return [];
  }

  return data || [];
}
