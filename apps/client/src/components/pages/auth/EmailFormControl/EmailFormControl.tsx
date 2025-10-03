"use client";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { EmailFormControlProps } from "./props";

type EmailFormControlError = string | undefined;

export type EmailFormControlRef = {
  getValue: () => string;
  getError: () => EmailFormControlError;
};

const EmailFormControl = forwardRef<EmailFormControlRef, EmailFormControlProps>(
  (_, ref) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<EmailFormControlError>();
    const hasError = Boolean(error);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      getError: () => error,
    }));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    const handleBlur = useCallback(() => {}, [value]);

    return (
      <FormControl>
        <FormLabel htmlFor="email">E-mail</FormLabel>
        <TextField
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={hasError}
          helperText={error}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={hasError ? "error" : "primary"}
        />
      </FormControl>
    );
  }
);

EmailFormControl.displayName = "EmailFormControl";

export default EmailFormControl;
