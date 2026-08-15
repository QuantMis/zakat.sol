"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { STORAGE_KEY } from "@/state/settings-store";
import { useZakatSettings } from "@/state/zakat-settings";

/**
 * The policy says the settings are yours to delete, so the page carries the
 * control rather than describing where to find it.
 */
export function ClearSettingsButton() {
  const { reset } = useZakatSettings();
  const [cleared, setCleared] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[13px] border border-line bg-cream-soft px-5 py-4">
      <div className="flex min-w-[220px] flex-1 flex-col gap-1">
        <span className="text-[14.5px] font-medium">Clear stored settings</span>
        <span className="font-mono text-[11.5px] text-faint">{STORAGE_KEY}</span>
      </div>

      {cleared ? (
        <span className="font-mono text-[12px] text-brand">Cleared — back to defaults</span>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          reset();
          setCleared(true);
        }}
      >
        Clear
      </Button>
    </div>
  );
}
