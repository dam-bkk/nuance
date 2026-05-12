"use client";

import { useEffect } from "react";
import { pullSync, pushSync } from "@/lib/sync";

export default function SyncProvider() {
  useEffect(() => {
    pullSync().then(() => pushSync());
  }, []);
  return null;
}
