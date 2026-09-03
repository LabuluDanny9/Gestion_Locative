import { Download, FileImage, FileText, FolderLock, Search } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documentKindLabels, formatFileSize } from "./document-data";
import { DeleteDocumentButton, DocumentUploader } from "./document-controls";
import type { loadDocumentLibrary } from "@/services/document-read-model";

type Library = Awaited<ReturnType<typeof loadDocumentLibrary>>;
const dateFormatter = new Intl.DateTimeFormat("fr-CD", { dateStyle: "medium" });

export function DocumentLibrary({ library }: { library: Library }) {
  return <div className="space-y-6 sm:space-y-8">
    <PageHeader description="Centralisez les fichiers réels de l’organisation, des propriétés, des locataires et des contrats." eyebrow="Stockage privé" title="Documents" />
    <div className="flex flex-wrap gap-2"><Badge variant="secondary"><FolderLock />Supabase Storage privé</Badge><Badge variant="outline">{library.documents.length} document(s) affiché(s)</Badge></div>

    <div className={library.canManage ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" : ""}>
      <div className="space-y-5">
        <Card><CardContent><form action="/documents" className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_1fr_1fr_auto]" method="GET">
          <label className="relative text-xs font-medium">Recherche<Search className="absolute bottom-3 left-3 size-4 text-muted-foreground" /><input className="mt-1 h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm" defaultValue={library.filters.query} name="q" placeholder="Nom, catégorie ou dossier…" /></label>
          <label className="text-xs font-medium">Type<select className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue={library.filters.kind ?? ""} name="type"><option value="">Tous les types</option>{Object.entries(documentKindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-xs font-medium">Classement<select className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue={library.filters.link ?? ""} name="lien"><option value="">Tous les dossiers</option><option value="organization">Organisation</option><option value="property">Propriétés</option><option value="tenant">Locataires</option><option value="lease">Contrats</option></select></label>
          <Button className="self-end" type="submit">Filtrer</Button>
        </form></CardContent></Card>

        <Card><CardHeader><CardTitle>Bibliothèque</CardTitle><CardDescription>Les liens de téléchargement privés expirent automatiquement après cinq minutes.</CardDescription></CardHeader><CardContent className="p-0">
          {library.documents.length ? <div className="divide-y">{library.documents.map((document) => {
            const Icon = document.mimeType.startsWith("image/") ? FileImage : FileText;
            return <article className="flex items-center gap-3 px-4 py-4 sm:px-6" key={document.id}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium" title={document.name}>{document.name}</p><p className="mt-1 text-xs text-muted-foreground">{document.kindLabel} · {document.source.label} · {formatFileSize(document.size)} · {dateFormatter.format(new Date(document.createdAt))}</p></div>
              <div className="flex shrink-0 items-center gap-1">{document.downloadUrl ? <Button asChild aria-label={`Télécharger ${document.name}`} size="icon-sm" title="Télécharger" variant="ghost"><a href={document.downloadUrl}><Download /></a></Button> : <Badge variant="destructive">Indisponible</Badge>}{library.canManage ? <DeleteDocumentButton id={document.id} name={document.name} /> : null}</div>
            </article>;
          })}</div> : <div className="p-6"><EmptyState description="Téléversez un fichier réel ou modifiez les filtres sélectionnés." icon={FolderLock} title="Aucun document" /></div>}
        </CardContent></Card>
      </div>

      {library.canManage ? <Card className="h-fit xl:sticky xl:top-24"><CardHeader><CardTitle>Ajouter un document</CardTitle><CardDescription>Le fichier sera chiffré en transit et conservé dans un bucket privé.</CardDescription></CardHeader><CardContent><DocumentUploader options={library.options} /></CardContent></Card> : null}
    </div>
  </div>;
}
