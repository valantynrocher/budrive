import { Button, Card, List, ListItem, Stack, Typography } from "@mui/material";
import Link from "next/link";

const OnboardingPage = () => {
  return (
    <Stack direction="row" justifyContent="center">
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
        <Typography variant="h2" gutterBottom>
          Bienvenue dans{" "}
          <Typography
            variant="inherit"
            component="span"
            sx={{ color: "secondary.main" }}
          >
            Budrive
          </Typography>{" "}
          !
        </Typography>

        <Typography gutterBottom>
          Pour faire vos premiers pas, nous devons connaître quelques
          informations essentielles.
        </Typography>

        <Typography gutterBottom>
          A l'issue de ces étapes, vous aurez une première idée du coût
          d'utilisation global et par kilomètre de votre véhicule.
        </Typography>

        <Typography gutterBottom>
          Avant de commencer, assurez-vous d'avoir ces informations en votre
          possession :
        </Typography>

        <List>
          <ListItem>
            Votre véhicule : Marque, Modèle, Carburant, Immatriculation,
            Kilométrage, Date et prix d'achat.
          </ListItem>
          <ListItem>
            Votre assurance : Le montant de votre cotisation annuelle ainsi que
            la date anniversaire du contrat en cours
          </ListItem>
        </List>

        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="outlined" color="secondary">
            Ignorer
          </Button>
          <Link href="/onboarding/steps/1">
            <Button variant="contained" color="primary">
              Commencer
            </Button>
          </Link>
        </Stack>
      </Card>
    </Stack>
  );
};

export default OnboardingPage;
