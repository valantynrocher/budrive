"use client";
import { Card, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";

const Step2Page = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <Card
        sx={{
          width: 600,
          padding: 4,
          backgroundColor: "background.default",
          borderRadius: 2,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "divider",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Étape 2 : Votre véhicule et vous
        </Typography>

        <Typography gutterBottom>
          Informations sur l'achat de votre véhicule.
        </Typography>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Link href="/onboarding/steps/1">
            <Button variant="outlined" color="secondary">
              Précédent
            </Button>
          </Link>
          <Link href="/onboarding/steps/3">
            <Button variant="contained" color="primary">
              Suivant
            </Button>
          </Link>
        </Stack>
      </Card>
    </Stack>
  );
};

export default Step2Page;
