"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getFertilizerInventory() {
  const supabase = createSupabaseServer();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from("fertilizer_inventory")
    .select("*")
    .eq("farmer_id", session.session.user.id)
    .order("purchase_date", { ascending: false });

  if (error) {
    console.error("Error fetching fertilizer inventory:", error);
    return [];
  }

  return data;
}

export async function getFertilizerById(id: string) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("fertilizer_inventory")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching fertilizer:", error);
    return null;
  }

  return data;
}

export async function getFertilizerUsageById(fertilizerId: string) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("fertilizer_usage")
    .select(
      `
      *,
      land_parcels (
        parcel_name
      )
    `
    )
    .eq("inventory_id", fertilizerId)
    .order("application_date", { ascending: false });

  if (error) {
    console.error("Error fetching fertilizer usage:", error);
    return [];
  }

  return data || [];
}

export async function getLandParcels() {
  const supabase = createSupabaseServer();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from("land_parcels")
    .select("*")
    .eq("farmer_id", session.session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching land parcels:", error);
    return [];
  }

  return data || [];
}
