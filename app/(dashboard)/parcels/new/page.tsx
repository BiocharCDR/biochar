import NewParcelPage from "@/components/parcels/new-parcel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Parcel",
  description: "Add a new land parcel to your account",
};

export default function NewParcel() {
  return <NewParcelPage />;
}
