"use client";
import { ReactNode, useEffect, useState } from "react";
import SessionContext from "./SessionContext";
import { useRouter } from "next/navigation";

const REFRESH_CHECK_INTERVAL_MS = 60 * 1000;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL non configuré.");
}

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const UNIDENTIFIED_REDIRECT_URL = "/auth/sign-in";

  const refreshSession = async () => {
    try {
      // We use our internal route handler as proxy
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
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
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
