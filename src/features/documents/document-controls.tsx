"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { deleteDocumentAction, finalizeLibraryUploadAction, prepareLibraryUploadAction } from "./actions";

type Options = {
  properties: { id: string; name: string }[];
  tenants: { id: string; label: string; number: string }[];
  leases: { id: string; label: string; unit: string }[];
};

export function DocumentUploader({ options }: { options: Options }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [fileName, setFileName] = useState("");

  function submit(formData: FormData) {
    const file = formData.get("file");
    const link = String(formData.get("link") ?? "organization");
    if (!(file instanceof File) || !file.size) {
      toast.error("Choisissez un document.");
      return;
    }
    startTransition(async () => {
      const toastId = toast.loading("Téléversement du document…");
      const prepared = await prepareLibraryUploadAction({ fileName: file.name, mimeType: file.type, fileSize: file.size, link });
      if (!prepared.ok) {
        toast.error(prepared.message, { id: toastId });
        return;
      }
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.storage.from("organization-documents").uploadToSignedUrl(prepared.upload.path, prepared.upload.token, file, { contentType: file.type });
      if (error) {
        toast.error(`Téléversement impossible : ${error.message}`, { id: toastId });
        return;
      }
      const finalized = await finalizeLibraryUploadAction(prepared.upload);
      if (!finalized.ok) {
        toast.error(finalized.message, { id: toastId });
        return;
      }
      toast.success("Document enregistré.", { id: toastId });
      formRef.current?.reset();
      setFileName("");
      router.refresh();
    });
  }

  return <form action={submit} className="grid gap-4" ref={formRef}>
    <label className="text-sm font-medium">Classer dans
      <select className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue="organization" name="link">
        <option value="organization">Organisation · AMIRANDA EMPIRE</option>
        {options.properties.map((item) => <option key={item.id} value={`property:${item.id}`}>Propriété · {item.name}</option>)}
        {options.tenants.map((item) => <option key={item.id} value={`tenant:${item.id}`}>Locataire · {item.label} ({item.number})</option>)}
        {options.leases.map((item) => <option key={item.id} value={`lease:${item.id}`}>Contrat · {item.label}{item.unit ? ` · ${item.unit}` : ""}</option>)}
      </select>
    </label>
    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-5 text-center hover:border-brand-blue/50">
      <CloudUpload className="size-7 text-brand-blue" />
      <span className="mt-2 text-sm font-medium">{fileName || "Choisir un fichier"}</span>
      <span className="mt-1 text-xs text-muted-foreground">PDF, Word, JPG ou PNG · 10 Mo maximum</span>
      <Input accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="sr-only" name="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} type="file" />
    </label>
    <Button disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" /> : <CloudUpload />}Téléverser</Button>
  </form>;
}

export function DeleteDocumentButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function remove() {
    if (!window.confirm(`Supprimer définitivement « ${name} » ?`)) return;
    startTransition(async () => {
      const result = await deleteDocumentAction(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Document supprimé.");
      router.refresh();
    });
  }
  return <Button aria-label={`Supprimer ${name}`} disabled={pending} onClick={remove} size="icon-sm" title="Supprimer" variant="ghost">{pending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}</Button>;
}
