import SignInForm from "@/app/(front)/auth/(pages)/sign-in/SignInForm";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const SignInPage = () => {
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ width: "100%" }}>
        Connexion
      </Typography>
      <SignInForm />
      {/* 
      <Divider>ou</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("S'inscrire avec Google")}
          startIcon={<GoogleIcon />}
        >
          S&apos;inscrire avec Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("S'inscrire avec Facebook")}
          startIcon={<FacebookIcon />}
        >
          S&apos;inscrire avec Facebook
        </Button> */}
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
      {/* </Box> */}
    </>
  );
};

export default SignInPage;
