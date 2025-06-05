import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { EmailFormControlProps } from "./props";

const EmailFormControl = (props: EmailFormControlProps) => {
  const { error } = props;

  return (
    <FormControl>
      <FormLabel htmlFor="email">E-mail</FormLabel>
      <TextField
        error={Boolean(error)}
        helperText={error}
        id="email"
        type="text"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={Boolean(error) ? "error" : "primary"}
        slotProps={{
          htmlInput: {
            // prettier-ignore
            pattern:
              "^[a-zA-Z0-9]+([._%+\\-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9\\-]+(\\.[a-zA-Z]{2,})+$",
          },
        }}
      />
    </FormControl>
  );
};

export default EmailFormControl;
