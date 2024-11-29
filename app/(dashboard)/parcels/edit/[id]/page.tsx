import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { EditParcelForm } from "@/components/parcels/edit-parcel-form";

interface EditParcelPageProps {
  params: {
    id: string;
  };
}

export default async function EditParcelPage({ params }: EditParcelPageProps) {
  const supabase = createSupabaseServer();

  // Fetch parcel with its documents
  const { data: parcel, error } = await supabase
    .from("land_parcels")
    .select(
      `
      *,
      parcel_documents (
        id,
        document_type,
        document_url,
        document_name,
        verification_status
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !parcel) {
    notFound();
  }
  console.log(parcel);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Parcel</h1>
        <p className="text-muted-foreground">
          Update the details of your land parcel
        </p>
      </div>

      <EditParcelForm parcel={parcel} />
    </div>
  );
}
