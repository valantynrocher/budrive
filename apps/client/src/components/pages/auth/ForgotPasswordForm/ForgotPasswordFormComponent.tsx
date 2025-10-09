"use client";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { ForgotPwdDto, ForgotPwdSchema } from "@budrive/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import forgotPwdServerAction from "./forgotPwdServerAction";

const ForgotPasswordFormComponent = () => {
  const [state, setState] = useState<null | {
    success: boolean;
    message?: string;
  }>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPwdDto>({
    resolver: zodResolver(ForgotPwdSchema),
    mode: "onBlur", // feedback progressif sans être trop agressif
  });

  const onSubmit = async (data: FormData) => {
    setState(null);

    const response = await forgotPwdServerAction(data);

    setState(response);
  };

  const handleErrorClose = () => {
    setState(null);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {state && state.success ? (
        <Alert severity="success">
          Si cet e-mail est associé à un compte utilisateur, vous recevrez un
          lien pour réinitialiser votre mot de passe.
        </Alert>
      ) : (
        <>
          <FormControl>
            <FormLabel htmlFor="email">E-mail</FormLabel>
            <TextField
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              color={Boolean(errors.email) ? "error" : "primary"}
              //
              variant="outlined"
              autoComplete="email"
              autoFocus
              fullWidth
              placeholder="your@email.com"
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained">
            {isSubmitting ? <CircularProgress size={24} /> : "Envoyer"}
          </Button>
        </>
      )}
      <ErrorSnackbar message={state?.message} onClose={handleErrorClose} />
    </Box>
  );
};

export default ForgotPasswordFormComponent;
