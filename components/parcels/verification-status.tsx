/*eslint-disable*/
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VerificationStatusProps {
  status: "pending" | "verified" | "rejected";
}

export function VerificationStatus({ status }: VerificationStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      title: "Verification Pending",
      description: "Your parcel is currently under review",
      variant: "destructive",
    },
    verified: {
      icon: CheckCircle2,
      title: "Verified",
      description: "Your parcel has been verified",
      variant: "success",
    },
    rejected: {
      icon: XCircle,
      title: "Verification Rejected",
      description: "Your parcel verification was rejected",
      variant: "destructive",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant as any} className=" w-fit">
      <Icon className="h-4 w-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{config.description}</AlertDescription>
    </Alert>
  );
}
