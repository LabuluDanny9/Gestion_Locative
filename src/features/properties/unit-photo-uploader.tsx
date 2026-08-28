"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhotoPreview = { id: string; name: string; url: string; file: File };

const maxPhotos = 12;
const maxFileSize = 6 * 1024 * 1024;

export function UnitPhotoUploader() {
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const objectUrls = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => objectUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const remaining = maxPhotos - photos.length;
    const validFiles = files.filter((file) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name} n’est pas une image JPG, PNG ou WebP.`);
        return false;
      }
      if (file.size > maxFileSize) {
        toast.error(`${file.name} dépasse la limite de 6 Mo.`);
        return false;
      }
      return true;
    }).slice(0, remaining);

    if (files.length > remaining) toast.warning(`Maximum ${maxPhotos} photos par logement.`);
    const previews = validFiles.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, name: file.name, url, file };
    });
    setPhotos((current) => syncInput([...current, ...previews]));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url);
        objectUrls.current = objectUrls.current.filter((url) => url !== photo.url);
      }
      return syncInput(current.filter((item) => item.id !== id));
    });
  }

  function makeCover(id: string) {
    setPhotos((current) => {
      const selected = current.find((item) => item.id === id);
      return selected ? syncInput([selected, ...current.filter((item) => item.id !== id)]) : current;
    });
  }

  function syncInput(next: PhotoPreview[]) {
    const transfer = new DataTransfer();
    next.forEach((photo) => transfer.items.add(photo.file));
    if (inputRef.current) inputRef.current.files = transfer.files;
    return next;
  }

  return (
    <div className="space-y-4">
      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 p-6 text-center transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5" htmlFor="unit-photos">
        <CloudUpload aria-hidden="true" className="size-8 text-brand-blue" />
        <span className="mt-3 font-medium">Ajoutez les photos de toutes les pièces</span>
        <span className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">Salon, chambres, cuisine, salles de bain, extérieur et dépendances. JPG, PNG ou WebP · 6 Mo maximum par photo · jusqu’à 12 photos.</span>
      </label>
      <Input accept="image/jpeg,image/png,image/webp" className="sr-only" id="unit-photos" multiple name="photos" onChange={addPhotos} ref={inputRef} type="file" />

      {photos.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div className="group overflow-hidden rounded-xl border bg-card" key={photo.id}>
              <div className="relative aspect-[4/3] bg-muted"><Image alt={`Aperçu ${photo.name}`} className="object-cover" fill sizes="(max-width: 640px) 100vw, 33vw" src={photo.url} unoptimized />{index === 0 && <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground"><Star />Photo principale</Badge>}</div>
              <div className="flex items-center gap-2 p-2"><p className="min-w-0 flex-1 truncate text-xs font-medium">{photo.name}</p>{index !== 0 && <Button aria-label={`Définir ${photo.name} comme photo principale`} onClick={() => makeCover(photo.id)} size="icon-sm" type="button" variant="ghost"><Star /></Button>}<Button aria-label={`Supprimer ${photo.name}`} onClick={() => removePhoto(photo.id)} size="icon-sm" type="button" variant="ghost"><Trash2 /></Button></div>
            </div>
          ))}
          {photos.length < maxPhotos && <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed text-center text-muted-foreground transition-colors hover:border-brand-blue/40 hover:text-brand-blue" htmlFor="unit-photos"><ImagePlus className="size-6" /><span className="mt-2 text-xs font-medium">Ajouter d’autres photos</span></label>}
        </div>
      ) : <p className="text-xs text-muted-foreground">Aucune photo sélectionnée. La première image ajoutée deviendra la photo principale.</p>}
    </div>
  );
}
