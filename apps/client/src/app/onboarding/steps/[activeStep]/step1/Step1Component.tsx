"use client";
import { Box, Typography } from "@mui/material";
import Step1Form from "./Step1Form";

const Step1Component = () => {
  return (
    <>
      <Box>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Veuillez renseigner les informations de base sur votre véhicule.
        </Typography>
      </Box>

      <Step1Form />
    </>
  );
};

export default Step1Component;
