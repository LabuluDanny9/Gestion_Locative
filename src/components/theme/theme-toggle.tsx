"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="Changer le thème"
          className="relative"
          onClick={() =>
            setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
          }
          size="icon"
          variant="ghost"
        >
          <Sun aria-hidden="true" className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon aria-hidden="true" className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Changer le thème</TooltipContent>
    </Tooltip>
  );
}
