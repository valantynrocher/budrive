"use client";
import { ReactNode, useEffect, useState } from "react";
import SessionContext from "./SessionContext";

const REFRESH_CHECK_INTERVAL_MS = 60 * 1000;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!BACKEND_URL) {
    console.error(
      "Erreur SessionProvider: NEXT_PUBLIC_BACKEND_URL non configuré."
    );
  }

  const refreshSession = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL!}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error(
        "Erreur réseau/générale lors du rafraichissement de token:",
        error
      );
    }
  };

  const logout = async () => {
    if (!BACKEND_URL) return;

    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Session Provider > Échec du logout", e);
    } finally {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    refreshSession().then(() => setIsLoading(false));

    const intervalId = setInterval(async () => {
      await refreshSession();
    }, REFRESH_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SessionContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
