"use client";
import EmailFormControl from "@/components/pages/auth/EmailFormControl";
import { EmailFormControlRef } from "@/components/pages/auth/EmailFormControl/EmailFormControl";
import PasswordFormControl, {
  PasswordFormControlRef,
} from "@/components/pages/auth/PasswordFormControl/PasswordFormControl";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { supabase } from "@/utils/supabase/browser";
import translateErrorCode from "@/utils/supabase/error-translation";
import z, { authDataSchemaBase } from "@/utils/zod/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const translateAuthErrorCode = translateErrorCode("auth");

const SignInForm = () => {
  const emailRef = useRef<EmailFormControlRef>(null);
  const passwordRef = useRef<PasswordFormControlRef>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const handleErrorClose = () => {
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perforom client validations on form's inputs
    const emailError = emailRef.current?.getError();
    if (Boolean(emailError)) return;

    const passwordErrors = passwordRef.current?.getErrors();
    const hasPasswordErrors = passwordErrors
      ? Object.keys(passwordErrors).length > 0
      : false;
    if (hasPasswordErrors) return;

    const email = emailRef.current?.getValue();
    if (!email) return;

    const { password } = passwordRef.current?.getValues() ?? {};
    if (!password) return;

    // No client error : perform server action
    setLoading(true);
    setServerError(null);

    // Send Sign Up data to the server
    const data: z.infer<typeof authDataSchemaBase> = {
      email,
      password,
    };
    const { error: authError } = await supabase.auth.signInWithPassword(data);

    // Deal with server action response
    // Deal with the server's response
    if (authError) {
      setServerError(translateAuthErrorCode(authError.code));
      setLoading(false);
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <EmailFormControl ref={emailRef} />
      <PasswordFormControl ref={passwordRef} withForgot />
      <Button type="submit" fullWidth variant="contained">
        {loading ? <CircularProgress size={24} /> : "Se connecter"}
      </Button>

      <ErrorSnackbar message={serverError} onClose={handleErrorClose} />
    </Box>
  );
};

export default SignInForm;
