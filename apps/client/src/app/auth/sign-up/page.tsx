import SignUpForm from "@/components/pages/auth/SignUpForm";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ width: "100%" }}>
        Inscription
      </Typography>
      <SignUpForm />
      <Typography sx={{ textAlign: "center" }}>
        Déjà inscrit ?{" "}
        <Link
          href="/auth/sign-in"
          style={{
            alignSelf: "center",
          }}
        >
          Se connecter
        </Link>
      </Typography>
    </>
  );
};

export default SignUpPage;
