"use client";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { type SignUpDto, SignUpSchema } from "@budrive/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import signupServerAction from "./signupServerAction";

const SignUpFormComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpDto>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur", // feedback progressif sans être trop agressif
  });

  const onSubmit = async (data: FormData) => {
    setError(null);

    const response = await signupServerAction(data);
    if (!response.success && response.message) {
      setError(response.message);
    }
  };

  const handleErrorClose = () => {
    setError(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword((display) => !display);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
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

        <FormControl>
          <FormLabel htmlFor="password">Mot de passe</FormLabel>
          <OutlinedInput
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
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
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
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
            type={showPassword ? "text" : "password"}
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
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
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

      <ErrorSnackbar message={error} onClose={handleErrorClose} />
    </>
  );
};

export default SignUpFormComponent;
