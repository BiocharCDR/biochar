import { ParcelDocument } from "@/types";
import { File, FileCheck, FileX } from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  document_type: string;
  document_url: string;
  verification_status: "pending" | "verified" | "rejected";
  document_name: string;
}

interface DocumentListProps {
  documents: ParcelDocument[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const getDocumentIcon = (status: Document["verification_status"]) => {
    switch (status) {
      case "verified":
        return FileCheck;
      case "rejected":
        return FileX;
      default:
        return File;
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => {
        const Icon = getDocumentIcon(
          doc.verification_status as Document["verification_status"]
        );
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium capitalize">
                  {doc.document_type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {doc.document_name}
                </p>
              </div>
            </div>
            <Link
              href={doc.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View Document
            </Link>
          </div>
        );
      })}
      {documents.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents uploaded yet
        </p>
      )}
    </div>
  );
}
