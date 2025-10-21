"use client";
import {
  AuthErrors,
  OnboardingStatus,
  type ConfirmResponseDto,
} from "@budrive/validation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const ConfirmPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      router.replace(
        `/auth/sign-in?error=${AuthErrors.URL_CONFIRM_TOKEN_MISSING}`
      );
      return;
    }

    // éviter un double appel à l'api de confirmation
    if (hasConfirmedRef.current) {
      return;
    }

    const processConfirmation = async () => {
      hasConfirmedRef.current = true;

      try {
        const handlerResponse = await fetch("/api/auth/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const handlerBody = await handlerResponse.json();

        if (handlerResponse.ok) {
          router.replace("/dashboard");
        } else {
          const errorMessage =
            handlerBody.message || AuthErrors.CONFIRM_TOKEN_UNKNOW_ERROR;
          router.replace(`/auth/sign-in?error=${errorMessage}`);
        }
      } catch (error) {
        console.error("Erreur réseau/générale lors de la confirmation:", error);
        router.replace(
          `/auth/sign-in?error=${AuthErrors.CONFIRM_TOKEN_UNKNOW_ERROR}`
        );
      }
    };

    processConfirmation();
  }, [token, router]);

  return null;
};

export default ConfirmPage;
