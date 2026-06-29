"use client";

import { ApiClient } from "@agentos/api-client";
import { useEffect, useState } from "react";

type HealthState = "checking" | "ready" | "unavailable";

const labels: Record<HealthState, string> = {
  checking: "正在检查 API",
  ready: "API 已就绪",
  unavailable: "API 暂未连接",
};

export function HealthStatus() {
  const [state, setState] = useState<HealthState>("checking");

  useEffect(() => {
    const client = new ApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
    });

    void client
      .getHealth()
      .then(() => setState("ready"))
      .catch(() => setState("unavailable"));
  }, []);

  return (
    <div
      aria-live="polite"
      className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]"
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${
          state === "ready"
            ? "bg-[var(--success)]"
            : state === "unavailable"
              ? "bg-[var(--danger)]"
              : "animate-pulse bg-[var(--accent)]"
        }`}
      />
      {labels[state]}
    </div>
  );
}
