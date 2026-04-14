import { useEffect, useState } from "react";

export type SiteSettings = Record<string, string>;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data || {});
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return { settings, isLoading };
}
