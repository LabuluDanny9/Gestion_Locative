import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<typeof Input> & {
  containerClassName?: string;
};

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <label className={cn("relative block", containerClassName)}>
      <span className="sr-only">{props["aria-label"] ?? "Rechercher"}</span>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-10 rounded-xl bg-background pl-9 shadow-xs", className)} type="search" {...props} />
    </label>
  );
}
