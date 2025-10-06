import SignInForm from "@/components/pages/auth/SignInForm";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: { error?: string };
}) => {
  const { error } = await searchParams;
  const decodedMessage = error ? decodeURIComponent(error) : null;
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ width: "100%" }}>
        Connexion
      </Typography>
      <SignInForm urlError={decodedMessage} />
      <Typography sx={{ textAlign: "center" }}>
        Pas encore pas inscrit ?{" "}
        <Link
          href="/auth/sign-up"
          style={{
            alignSelf: "center",
          }}
        >
          S&apos;enregistrer
        </Link>
      </Typography>
    </>
  );
};

export default SignInPage;
