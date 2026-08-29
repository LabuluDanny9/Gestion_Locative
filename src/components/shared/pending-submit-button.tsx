"use client";

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PendingSubmitButton({ idleLabel, pendingLabel }: { idleLabel: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return <Button aria-disabled={pending} disabled={pending} type="submit"><Save />{pending ? pendingLabel : idleLabel}</Button>;
}
