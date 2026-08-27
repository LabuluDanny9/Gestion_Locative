import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="mb-5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span className="flex items-center gap-1" key={`${item.label}-${index}`}>
          {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5" />}
          {item.href ? <Link className="transition-colors hover:text-foreground" href={item.href}>{item.label}</Link> : <span aria-current="page" className="font-medium text-foreground">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
