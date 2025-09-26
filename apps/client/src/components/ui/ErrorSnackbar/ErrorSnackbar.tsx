import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { ErrorSnackbarProps } from "./props";

const ErrorSnackbar = (props: ErrorSnackbarProps) => {
  const { message, onClose } = props;

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    if (onClose) onClose();
  };

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
