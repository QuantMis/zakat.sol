"use client";

import { PageHeading } from "@/components/layout/page-heading";
import { hawlCompleted } from "@/data/nisab";
import { portfolio } from "@/data/portfolio";
import { formatDate, formatYear } from "@/lib/format";
import { useZakatSettings } from "@/state/zakat-settings";

export function CalculationHeading() {
  const { settings } = useZakatSettings();

  return (
    <PageHeading
      title={`Zakat for ${formatYear(portfolio.scannedAt, settings.calendar)}`}
      subtitle={`Valued at scan time · hawl completed ${formatDate(hawlCompleted, settings.calendar)}`}
    />
  );
}
