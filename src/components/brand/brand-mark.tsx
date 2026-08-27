import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({ className, compact = false, inverse = false }: BrandMarkProps) {
  return (
    <div className={cn("inline-flex max-w-full items-center", className)} data-inverse={inverse || undefined}>
      <Image
        alt="AMIRANDA EMPIRE"
        className={cn("h-12 w-auto max-w-full object-contain", compact && "h-10")}
        height={408}
        priority
        src="/images/logo_AMIRANDA_EMPIRE-.png"
        width={612}
      />
    </div>
  );
}
