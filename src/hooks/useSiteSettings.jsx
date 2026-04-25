import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({ settings: {}, isLoading: true });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data === 'object' && !data.error) {
          setSettings(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
