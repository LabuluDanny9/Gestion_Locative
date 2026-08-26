import type { LucideIcon } from "lucide-react";
import {
  BadgeAlert,
  Bell,
  Building2,
  ChartNoAxesCombined,
  FileSignature,
  FolderOpen,
  House,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  WalletCards,
  Wrench,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  enabled: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const appNavigation: NavigationGroup[] = [
  {
    label: "Gestion",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/espace", enabled: true },
      { label: "Propriétés", icon: Building2, enabled: false },
      { label: "Logements", icon: House, enabled: false },
      { label: "Locataires", icon: Users, enabled: false },
      { label: "Contrats", icon: FileSignature, enabled: false },
    ],
  },
  {
    label: "Finances",
    items: [
      { label: "Paiements", icon: WalletCards, enabled: false },
      { label: "Arriérés", icon: BadgeAlert, enabled: false },
      { label: "Garanties", icon: ShieldCheck, enabled: false },
      { label: "Reçus", icon: ReceiptText, enabled: false },
    ],
  },
  {
    label: "Analyse",
    items: [
      { label: "Rapports", icon: ChartNoAxesCombined, enabled: false },
      { label: "Notifications", icon: Bell, enabled: false },
    ],
  },
  {
    label: "Système",
    items: [
      { label: "Documents", icon: FolderOpen, enabled: false },
      { label: "Maintenance", icon: Wrench, enabled: false },
      { label: "Utilisateurs", icon: UsersRound, enabled: false },
      { label: "Paramètres", icon: Settings, href: "/profil", enabled: true },
    ],
  },
];

export function getCurrentNavigationItem(pathname: string) {
  return appNavigation
    .flatMap((group) => group.items)
    .find((item) => item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`)));
}
