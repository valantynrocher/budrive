"use client";
import { ReactNode, useEffect, useState } from "react";
import SessionContext from "./SessionContext";
import { useRouter } from "next/navigation";
import config from "@/lib/api/config";

// BASED ON 85% OF JWT_EXPIRES_IN
const REFRESH_CHECK_INTERVAL_MS = 3060000;

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const UNIDENTIFIED_REDIRECT_URL = "/auth/sign-in";

  const refreshSession = async () => {
    try {
      // We use our internal route handler as proxy
      const response = await fetch(`${config.appUrl}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

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
    try {
      await fetch(`${config.backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Session Provider > Échec du logout", e);
    } finally {
      setIsAuthenticated(false);
      return true;
    }
  };

  useEffect(() => {
    refreshSession().then(() => setIsLoading(false));

    const intervalId = setInterval(async () => {
      await refreshSession();
    }, REFRESH_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace(UNIDENTIFIED_REDIRECT_URL);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <SessionContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
