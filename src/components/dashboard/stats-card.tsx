"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { prettifyKey } from "@/lib/utils";
import type { Stats } from "@/types";

function numericEntries(stats: Stats | undefined) {
  if (!stats) return [];
  return Object.entries(stats).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number"
  );
}

export function StatsCard({
  title,
  icon: Icon,
  query,
}: {
  title: string;
  icon: LucideIcon;
  query: {
    data?: Stats;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
}) {
  const entries = numericEntries(query.data);
  const [headline, ...rest] = entries;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {query.isLoading && <LoadingState message="Carregando..." />}
        {query.isError && (
          <ErrorState
            message="Sem ligação à API."
            onRetry={() => query.refetch()}
          />
        )}
        {!query.isLoading && !query.isError && (
          <>
            <p className="text-2xl font-bold text-foreground">
              {headline ? headline[1] : "—"}
            </p>
            {headline && (
              <p className="text-xs text-muted-foreground">{prettifyKey(headline[0])}</p>
            )}
            {rest.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                {rest.slice(0, 5).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span>{prettifyKey(key)}</span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
