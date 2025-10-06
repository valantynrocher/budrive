import { AuthErrors } from "@budrive/validation";
import { redirect } from "next/navigation";

const ConfirmPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const { token } = await searchParams;

  if (!token) {
    // Redirection vers la page de connexion avec un message d'erreur
    redirect(`/auth/sign-in?error=${AuthErrors.URL_CONFIRM_TOKEN_MISSING}`);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store", // Important pour ne pas cacher cette requête
    });

    if (!response.ok) {
      const errorBody = await response.json();
      redirect(`/auth/sign-in?error=${errorBody.message}`);
    }

    redirect("/dashboard");
  } catch (error) {
    // Si l'erreur est l'exception levée par `redirect()`, nous la relançons pour que Next.js la gère.
    // L'objet d'erreur de redirection a un champ `digest` contenant "NEXT_REDIRECT".
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      // Si c'est une redirection, on la relance. Next.js gérera la redirection.
      throw error;
    }

    // Si c'est une VRAIE erreur (ex: erreur réseau/fetch, serveur backend non joignable)
    console.error(
      "Erreur critique: Échec de connexion au backend/Réseau",
      error
    );
    redirect(`/auth/sign-in?error=${AuthErrors.CONFIRM_TOKEN_UNKNOW_ERROR}`);
  }
};

export default ConfirmPage;
