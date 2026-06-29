"use client";

import { ApiClient } from "@agentos/api-client";
import type { CurrentUser } from "@agentos/shared";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function AccountActions() {
  const api = useMemo(
    () =>
      new ApiClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      }),
    [],
  );
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    void api
      .getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch(() => setUser(null));
  }, [api]);

  if (!user) {
    return (
      <Link href="/login" className="text-sm text-[var(--accent)] hover:underline">
        登录 / 注册
      </Link>
    );
  }

  const logout = async () => {
    await api.logout();
    window.location.assign("/login");
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-[var(--muted)]">{user.name}</span>
      <button type="button" onClick={() => void logout()} className="hover:text-[var(--accent)]">
        退出
      </button>
    </div>
  );
}
