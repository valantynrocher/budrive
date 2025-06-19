"use client";
import { PasswordFormControlProps } from "@/app/(front)/auth/PasswordFormControl/props";
import { type PasswordValues, passwordSchema } from "@/utils/zod/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Link from "next/link";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

type PasswordFormControlErrors = Partial<Record<keyof PasswordValues, string>>;

export type PasswordFormControlRef = {
  getValues: () => PasswordValues;
  getErrors: () => PasswordFormControlErrors;
};

const PasswordFormControl = forwardRef<
  PasswordFormControlRef,
  PasswordFormControlProps
>((props, ref) => {
  const { withForgot = false, withConfirm = false } = props;

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<PasswordFormControlErrors>({});
  const [display, setDisplay] = useState(false);
  const hasPasswordError = Boolean(errors.password);
  const hasConfirmatonError = Boolean(errors.confirmation);

  useImperativeHandle(ref, () => ({
    getValues: () => ({ password, confirmation }),
    getErrors: () => errors,
  }));

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmation(event.target.value);
  };

  const handleBlur = useCallback(() => {
    const result = passwordSchema.safeParse({ password, confirmation });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          // In this case, we don't care about the confirmation's input validation
          if (!withConfirm && field === "confirmation") return;

          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }
  }, [confirmation, password, withConfirm]);

  const handleClickDisplay = () => {
    setDisplay((display) => !display);
  };

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="password">Mot de passe</FormLabel>
        <OutlinedInput
          value={password}
          onChange={handlePasswordChange}
          onBlur={handleBlur}
          error={hasPasswordError}
          name="password"
          placeholder="••••••"
          id="password"
          autoComplete="current-password"
          autoFocus
          required
          fullWidth
          color={hasPasswordError ? "error" : "primary"}
          type={display ? "text" : "password"}
          endAdornment={
            <IconButton
              aria-label={
                display ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              onClick={handleClickDisplay}
              edge="end"
            >
              {display ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          }
        />
        <FormHelperText id="password-helper-text">
          {errors.password}
        </FormHelperText>
      </FormControl>
      {withConfirm && !withForgot ? (
        <FormControl>
          <FormLabel htmlFor="password-confirm">
            Confirmation du mot de passe
          </FormLabel>
          <OutlinedInput
            value={confirmation}
            onChange={handleConfirmationChange}
            onBlur={handleBlur}
            error={hasConfirmatonError}
            name="password-confirm"
            placeholder="••••••"
            id="password-confirm"
            required
            fullWidth
            color={hasConfirmatonError ? "error" : "primary"}
            type={display ? "text" : "password"}
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
            {errors.confirmation}
          </FormHelperText>
        </FormControl>
      ) : null}
      {withForgot && !withConfirm ? (
        <>
          <Link href="/auth/reset-password">Mot de passe oublié ?</Link>
        </>
      ) : null}
    </>
  );
});

PasswordFormControl.displayName = "PasswordFormControl";
export default PasswordFormControl;
