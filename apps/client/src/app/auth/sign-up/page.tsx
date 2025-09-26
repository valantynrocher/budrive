"use client";
import EmailFormControl from "@/components/pages/auth/EmailFormControl";
import { EmailFormControlRef } from "@/components/pages/auth/EmailFormControl/EmailFormControl";
import PasswordFormControl from "@/components/pages/auth/PasswordFormControl";
import { PasswordFormControlRef } from "@/components/pages/auth/PasswordFormControl/PasswordFormControl";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import translateErrorCode from "@/utils/supabase/error-translation";
import z, { authDataSchemaBase } from "@/utils/zod/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const translateAuthErrorCode = translateErrorCode("auth");

const SignUpPage = () => {
  const emailRef = useRef<EmailFormControlRef>(null);
  const passwordRef = useRef<PasswordFormControlRef>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

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
    // const data: z.infer<typeof authDataSchemaBase> = {
    //   email,
    //   password,
    // };
    // const { error: authError } = await supabase.auth.signUp(data);

    // Deal with the server's response
    // if (authError) {
    //   setServerError(translateAuthErrorCode(authError.code));
    //   setLoading(false);
    // } else {
    //   router.push("/dashboard");
    // }
  };

  const handleErrorClose = () => {
    setServerError(null);
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Inscription
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* <FormControl>
          <FormLabel htmlFor="displayName">Prénom & Nom</FormLabel>
          <TextField
            autoComplete="displayName"
            name="displayName"
            required
            fullWidth
            id="displayName"
            placeholder="John Doe"
            error={nameError}
            helperText={nameErrorMessage}
            color={nameError ? "error" : "primary"}
          />
        </FormControl> */}
        <EmailFormControl ref={emailRef} />
        <PasswordFormControl ref={passwordRef} withConfirm />
        <Button type="submit" fullWidth variant="contained">
          {loading ? <CircularProgress size={24} /> : "S'inscrire"}
        </Button>
      </Box>

      <ErrorSnackbar message={serverError} onClose={handleErrorClose} />

      {/* <Divider>
        <Typography sx={{ color: "text.secondary" }}>ou</Typography>
      </Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("S'inscrire avec Google")}
          startIcon={<GoogleIcon />}
        >
          S&apos;inscrire avec Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("S'inscrire avec Facebook")}
          startIcon={<FacebookIcon />}
        >
          S&apos;inscrire avec Facebook
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Déjà inscrit ?{" "}
          <Link href="/auth/sign-in" style={{ alignSelf: "center" }}>
            Se connecter
          </Link>
        </Typography>
      </Box> */}
    </>
  );
};

export default SignUpPage;
