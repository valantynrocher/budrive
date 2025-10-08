const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Validation for Route Handlers and Server Actions
if (typeof window === "undefined" && !BACKEND_URL) {
  throw new Error(
    "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini dans l'environnement serveur."
  );
}

// Validation for client
if (typeof window !== "undefined" && !BACKEND_URL) {
  console.error(
    "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini pour le client."
  );
}

// Exportation de la constante
export const config = {
  backendUrl: BACKEND_URL,
};
