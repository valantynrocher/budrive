"use client";
import EmailFormControl from "@/app/(auth)/(components)/EmailFormControl";
import PasswordFormControl from "@/app/(auth)/(components)/PasswordFormControl/PasswordFormControl";
import ErrorSnackbar from "@/components/ErrorSnackbar";
import { supabase } from "@/utils/supabase/browser";
import translateErrorCode from "@/utils/supabase/error-translation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormKeys = "email" | "password";
const initialErrors: Record<FormKeys, null | string> = {
  email: null,
  password: null,
};

const translateAuthErrorCode = translateErrorCode("auth");

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState(initialErrors);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perforom client validations on form's inputs
    const form = event.currentTarget;
    const inputs = Array.from(form.elements) as HTMLInputElement[];
    const newErrors: typeof inputErrors = Object.create(initialErrors);
    inputs.forEach((input) => {
      if (input.tagName !== "INPUT") return;

      if (!input.validity.valid) {
        newErrors[input.name as FormKeys] = input.validationMessage;
      }
    });
    console.log("signIn submit", {
      formIsValid: form.checkValidity(),
    });

    if (Object.keys(newErrors).length > 0) {
      setInputErrors(newErrors);
      return;
    }

    // No client error : perform server action
    setInputErrors(initialErrors);
    setLoading(true);
    setAuthErrorMessage("");

    const formData = new FormData(form);
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const { error: authError } = await supabase.auth.signInWithPassword(
      credentials
    );

    // Deal with server action response
    if (authError) {
      setAuthErrorMessage(translateAuthErrorCode(authError.code));
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleErrorClose = () => {
    setAuthErrorMessage("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <EmailFormControl error={inputErrors.email} />
      <PasswordFormControl error={inputErrors.password} withForgot={true} />
      {/* <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label="Se souvenir de moi"
    /> */}
      <Button type="submit" fullWidth variant="contained">
        {loading ? <CircularProgress size={24} /> : "Se connecter"}
      </Button>

      <ErrorSnackbar message={authErrorMessage} onClose={handleErrorClose} />
    </Box>
  );
};

export default SignInForm;
