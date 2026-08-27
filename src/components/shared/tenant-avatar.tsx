import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function TenantAvatar({ name, className, large = false }: { name: string; className?: string; large?: boolean }) {
  return (
    <Avatar className={cn(large && "size-16 sm:size-20", className)} size={large ? "lg" : "default"}>
      <AvatarFallback className={cn("bg-brand-blue/10 font-semibold text-brand-blue", large && "text-xl sm:text-2xl")}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
