"use client";

import type { ReactNode } from "react";

import { SalesStoreProvider } from "./propostas/store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SalesStoreProvider>{children}</SalesStoreProvider>;
}
