"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export const DynamicTitle = () => {
  const { settings } = useAuth();

  useEffect(() => {
    if (settings?.site_name) {
      document.title = settings.site_name;
    }
  }, [settings]);

  return null;
};
