/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface FarmerDocumentsProps {
  farmerId: string;
}

interface Document {
  id: string;
  document_url: string;
  document_type: string | null;
  document_name: string | null;
  created_at: string;
  verification_status: string | null;
  source_type: string;
  source_id: string;
}

export function FarmerDocuments({ farmerId }: FarmerDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchDocuments() {
      // Fetch parcel documents
      const { data: parcelDocs } = await supabase
        .from("parcel_documents")
        .select(
          `
          id,
          document_url,
          document_type,
          document_name,
          created_at,
          verification_status,
          parcel_id
        `
        )
        .in("parcel_id", [
          supabase.from("land_parcels").select("id").eq("farmer_id", farmerId),
        ]);

      // Fetch fertilizer proofs
      const { data: fertilizerDocs } = await supabase
        .from("fertilizer_inventory")
        .select(
          `
          id,
          purchase_proof_url,
          created_at
        `
        )
        .eq("farmer_id", farmerId)
        .not("purchase_proof_url", "is", null);

      // Format all documents into a consistent structure
      const formattedDocs: any[] = [
        ...(parcelDocs || []).map((doc) => ({
          id: doc.id,
          document_url: doc.document_url,
          document_type: doc.document_type,
          document_name: doc.document_name,
          created_at: doc.created_at,
          verification_status: doc.verification_status,
          source_type: "parcel",
          source_id: doc.parcel_id,
        })),
        ...(fertilizerDocs || []).map((doc) => ({
          id: doc.id,
          document_url: doc.purchase_proof_url,
          document_type: "fertilizer_proof",
          document_name: "Fertilizer Purchase Proof",
          created_at: doc.created_at,
          verification_status: "verified",
          source_type: "fertilizer",
          source_id: doc.id,
        })),
      ];

      setDocuments(formattedDocs);
      setIsLoading(false);
    }

    fetchDocuments();
  }, [farmerId]);

  const filteredDocuments = documents.filter((doc) => {
    if (filter === "all") return true;
    if (filter === "verified") return doc.verification_status === "verified";
    if (filter === "pending") return doc.verification_status === "pending";
    if (filter === "rejected") return doc.verification_status === "rejected";
    return doc.source_type === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                documents.filter((d) => d.verification_status === "verified")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Approved documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                documents.filter((d) => d.verification_status === "pending")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                documents.filter((d) => d.verification_status === "rejected")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Rejected documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Manage and view uploaded documents
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="rejected">Rejected Only</SelectItem>
                <SelectItem value="parcel">Parcel Documents</SelectItem>
                <SelectItem value="fertilizer">Fertilizer Proofs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex w-full items-center justify-between">
                      <Badge
                        variant={
                          doc.verification_status === "verified"
                            ? "default"
                            : doc.verification_status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {doc.verification_status || "unverified"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(doc.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {doc.document_name || "Unnamed Document"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {doc.document_type || "No type specified"}
                      </p>
                    </div>
                    <div className="flex w-full justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.document_url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
