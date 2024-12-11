// components/biochar/biochar-status-timeline.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";
import { Tables } from "@/supabase/schema";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface BiocharStatusTimelineProps {
  biochar: Tables<"biochar_production">;
}

export default function BiocharStatusTimeline({
  biochar,
}: BiocharStatusTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-blue-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Timeline</CardTitle>
        <CardDescription>Track the production process status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Production Start */}
          <div className="flex items-start gap-4">
            {getStatusIcon(biochar.status || "in_progress")}
            <div>
              <p className="font-medium">Production Started</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(biochar.production_date)} at{" "}
                {formatTime(biochar.start_time)}
              </p>
            </div>
          </div>

          {/* Production End */}
          <div className="flex items-start gap-4">
            {getStatusIcon(biochar.end_time ? "completed" : "in_progress")}
            <div>
              <p className="font-medium">Production Completed</p>
              <p className="text-sm text-muted-foreground">
                {biochar.end_time
                  ? `${formatDate(biochar.production_date)} at ${formatTime(
                      biochar.end_time
                    )}`
                  : "In progress"}
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-start gap-4">
            {getStatusIcon(biochar.status || "in_progress")}
            <div>
              <p className="font-medium">Current Status</p>
              <p
                className={`text-sm font-medium ${getStatusColor(
                  biochar.status || "in_progress"
                )}`}
              >
                {(biochar.status ?? "in_progress").charAt(0).toUpperCase() +
                  (biochar.status ?? "in_progress").slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {formatDate(biochar.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
