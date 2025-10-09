"use client";
import ResetPasswordForm from "@/components/pages/auth/ResetPasswordForm";
import config from "@/lib/api/config";
import { AuthErrors } from "@budrive/validation";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ResetPwdPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasCheckTokenRef = useRef(false);
  const [state, setState] = useState<{
    success: null | boolean;
    message: string | null;
  }>({
    success: null,
    message: null,
  });

  useEffect(() => {
    if (!token) {
      setState((prev) => ({
        ...prev,
        success: false,
        message: AuthErrors.URL_RESET_PWD_TOKEN_MISSING,
      }));
    }

    if (hasCheckTokenRef.current) {
      return;
    }

    const processCheckToken = async () => {
      hasCheckTokenRef.current = true;

      try {
        const response = await fetch(
          `${config.backendUrl}/auth/verify-reset-token?token=${token}`,
          {
            method: "GET",
          }
        );

        const handlerBody = await response.json();

        if (response.ok) {
          setState((prev) => ({
            ...prev,
            success: true,
          }));
        } else {
          const errorMessage =
            handlerBody.message ||
            AuthErrors.CHECK_RESET_PWD_TOKEN_UNKNOW_ERROR;
          //   router.replace(`/auth/sign-in?error=${errorMessage}`);
          console.error(
            "Erreur lors de la vérification du token:",
            errorMessage
          );
          setState((prev) => ({
            ...prev,
            success: false,
            message: errorMessage,
          }));
        }
      } catch (error) {
        console.error(
          "Erreur réseau/générale lors de la vérification du token:",
          error
        );
        setState((prev) => ({
          ...prev,
          success: false,
          message: error as string,
        }));
      }
    };

    processCheckToken();
  }, [token, router]);

  if (!hasCheckTokenRef.current) return;

  if (!state.success) {
    return state.message;
  }

  return (
    <>
      <Typography component="h1" variant="h1" sx={{ width: "100%" }}>
        Réinitialisation du mot de passe
      </Typography>
      <ResetPasswordForm token={token!} />
    </>
  );
};

export default ResetPwdPage;
