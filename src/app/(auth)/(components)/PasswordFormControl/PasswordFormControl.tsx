import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { PasswordFormControlProps } from "@/app/(auth)/(components)/PasswordFormControl/props";
import MuiLink from "@mui/material/Link";
import ForgotPassword from "@/app/(auth)/(pages)/sign-in/ForgotPassword";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

const PasswordFormControl = (props: PasswordFormControlProps) => {
  const { error, withForgot = false, withConfirm = false } = props;
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(false);

  const handleClickForgot = (reason: "open" | "close") => () => {
    setOpen(reason === "open");
  };

  const handleClickDisplay = () => {
    setDisplay((display) => !display);
  };

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="password">Mot de passe</FormLabel>
        <OutlinedInput
          error={Boolean(error)}
          name="password"
          placeholder="••••••"
          id="password"
          autoComplete="current-password"
          autoFocus
          required
          fullWidth
          color={Boolean(error) ? "error" : "primary"}
          type={display ? "text" : "password"}
          slotProps={{
            input: {
              minLength: 6,
            },
          }}
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
        <FormHelperText id="password-helper-text">{error}</FormHelperText>
      </FormControl>
      {withConfirm && !withForgot ? (
        <FormControl>
          <FormLabel htmlFor="password-confirm">
            Confirmation du mot de passe
          </FormLabel>
          <OutlinedInput
            error={Boolean(error)}
            name="password-confirm"
            placeholder="••••••"
            id="password-confirm"
            required
            fullWidth
            color={Boolean(error) ? "error" : "primary"}
            type={display ? "text" : "password"}
            slotProps={{
              input: {
                minLength: 6,
              },
            }}
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
          <FormHelperText id="password-helper-text">{error}</FormHelperText>
        </FormControl>
      ) : null}
      {withForgot && !withConfirm ? (
        <>
          <MuiLink
            component="button"
            type="button"
            onClick={handleClickForgot("open")}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Mot de passe oublié ?
          </MuiLink>
          <ForgotPassword
            open={open}
            handleClose={handleClickForgot("close")}
          />
        </>
      ) : null}
    </>
  );
};

export default PasswordFormControl;
