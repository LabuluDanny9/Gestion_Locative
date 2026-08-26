import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T>({ rows, columns, getRowKey, emptyMessage = "Aucune donnée", className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <Table>
        <TableHeader className="bg-muted/45">
          <TableRow>
            {columns.map((column) => (
              <TableHead className={cn("h-11 px-4 text-xs font-semibold uppercase tracking-wide", column.className)} key={column.key}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map((row) => (
            <TableRow className="h-14" key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell className={cn("px-4", column.className)} key={column.key}>{column.render(row)}</TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell className="h-28 text-center text-muted-foreground" colSpan={columns.length}>{emptyMessage}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
