import ForgotPasswordForm from "@/components/pages/auth/ForgotPasswordForm";
import Typography from "@mui/material/Typography";

const ForgotPasswordPage = async () => {
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ width: "100%" }}>
        Mot de passe oublié
      </Typography>
      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;
