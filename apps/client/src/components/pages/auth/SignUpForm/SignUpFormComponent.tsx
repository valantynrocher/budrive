"use client";
import { EmailFormControlRef } from "@/components/pages/auth/EmailFormControl/EmailFormControl";
import { PasswordFormControlRef } from "@/components/pages/auth/PasswordFormControl/PasswordFormControl";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { signupAction } from "@/lib/api/auth";
import { type SignUpDto, SignUpSchema } from "@budrive/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const SignUpFormComponent = () => {
  const emailRef = useRef<EmailFormControlRef>(null);
  const passwordRef = useRef<PasswordFormControlRef>(null);

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [display, setDisplay] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpDto>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur", // feedback progressif sans être trop agressif
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      await signupAction(data);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  const handleErrorClose = () => {
    setServerError(null);
  };

  const handleClickDisplay = () => {
    setDisplay((display) => !display);
  };

  if (success) {
    return (
      <Alert severity="success">
        Inscription réussie ! Vérifiez votre email pour confirmer votre compte.
      </Alert>
    );
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* <EmailFormControl ref={emailRef} /> */}
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

        {/* <PasswordFormControl ref={passwordRef} withConfirm /> */}

        <FormControl>
          <FormLabel htmlFor="password">Mot de passe</FormLabel>
          <OutlinedInput
            label="Mot de passe"
            type={display ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            color={Boolean(errors.password) ? "error" : "primary"}
            //
            autoComplete="current-password"
            autoFocus
            fullWidth
            placeholder="••••••"
            endAdornment={
              <IconButton
                aria-label={
                  display
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={handleClickDisplay}
                edge="end"
              >
                {display ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <FormHelperText id="password-helper-text">
            {errors.password?.message}
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password-confirm">
            Confirmation du mot de passe
          </FormLabel>
          <OutlinedInput
            label="Mot de passe"
            type={display ? "text" : "password"}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            color={Boolean(errors.confirmPassword) ? "error" : "primary"}
            //
            autoComplete="current-password"
            autoFocus
            fullWidth
            placeholder="••••••"
            endAdornment={
              <IconButton
                aria-label={
                  display
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={handleClickDisplay}
                edge="end"
              >
                {display ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <FormHelperText id="password-helper-text">
            {errors.confirmPassword?.message}
          </FormHelperText>
        </FormControl>

        <Button type="submit" fullWidth variant="contained">
          {isSubmitting ? <CircularProgress size={24} /> : "S'inscrire"}
        </Button>
      </Box>

      <ErrorSnackbar message={serverError} onClose={handleErrorClose} />
    </>
  );
};

export default SignUpFormComponent;
