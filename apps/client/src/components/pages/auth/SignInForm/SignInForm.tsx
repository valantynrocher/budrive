"use client";
import EmailFormControl from "@/components/pages/auth/EmailFormControl";
import { EmailFormControlRef } from "@/components/pages/auth/EmailFormControl/EmailFormControl";
import PasswordFormControl, {
  PasswordFormControlRef,
} from "@/components/pages/auth/PasswordFormControl/PasswordFormControl";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";

const SignInForm = (props: { urlError: string | null }) => {
  const emailRef = useRef<EmailFormControlRef>(null);
  const passwordRef = useRef<PasswordFormControlRef>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(props.urlError);

  const handleErrorClose = () => {
    setError(null);
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
    setError(null);
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

      <ErrorSnackbar message={error} onClose={handleErrorClose} />
    </Box>
  );
};

export default SignInForm;
