import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MutationFeedback({ error, success }: { error?: string; success?: string }) {
  if (error) {
    return (
      <Alert className="mb-6 border-destructive/30 bg-destructive/5" variant="destructive">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Enregistrement impossible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (success) {
    return (
      <Alert className="mb-6 border-status-paid/30 bg-status-paid/5">
        <CheckCircle2 aria-hidden="true" className="text-status-paid" />
        <AlertTitle>Enregistrement réussi</AlertTitle>
        <AlertDescription>{success}</AlertDescription>
      </Alert>
    );
  }
  return null;
}
