import { cn } from "@/lib/utils";

type MoneyDisplayProps = {
  amount: number;
  currency?: "USD" | "CDF";
  locale?: string;
  className?: string;
};

export function MoneyDisplay({ amount, currency = "USD", locale = "fr-CD", className }: MoneyDisplayProps) {
  return (
    <span className={cn("font-medium tabular-nums", className)}>
      {new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount)}
    </span>
  );
}
