const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Validation for Route Handlers and Server Actions
if (typeof window === "undefined") {
  if (!BACKEND_URL)
    throw new Error(
      "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini dans l'environnement serveur."
    );

  if (!APP_URL)
    throw new Error(
      "Erreur de configuration: NEXT_PUBLIC_APP_URL non défini dans l'environnement serveur."
    );
}

// Validation for client
if (typeof window !== "undefined") {
  if (!BACKEND_URL)
    console.error(
      "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini pour le client."
    );

  if (!APP_URL)
    console.error(
      "Erreur de configuration: NEXT_PUBLIC_APP_URL non défini pour le client."
    );
}

// Exportation de la constante
export default {
  backendUrl: BACKEND_URL,
  appUrl: APP_URL,
};
