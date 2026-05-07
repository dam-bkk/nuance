"use client";

import { useEffect } from "react";
import { pullSync } from "@/lib/sync";

export default function SyncProvider() {
  useEffect(() => { pullSync(); }, []);
  return null;
}
