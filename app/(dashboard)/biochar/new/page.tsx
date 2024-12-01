// app/(dashboard)/biochar/new/page.tsx

import { redirect } from "next/navigation";

import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BiocharForm } from "@/components/biochar/biochar-form";

export default async function NewBiocharPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch available biomass records for selection
  const { data: biomassRecords } = await supabase
    .from("biomass_production")
    .select(`*`)
    .eq("status", "stored")
    .order("harvest_date", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/biochar">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mt-4">
          New Biochar Production
        </h1>
        <p className="text-muted-foreground">
          Record a new biochar production batch
        </p>
      </div>

      <BiocharForm biomassRecords={biomassRecords || []} />
    </div>
  );
}
