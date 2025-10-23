import { ONBOARDING_STEPS } from "@/data/onboarding";
import { Box, Stack } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { StepsLayoutProps } from "./props";

const StepsLayout = async ({ children, params }: StepsLayoutProps) => {
  const activeStep = parseInt((await params).activeStep);
  const activeStepIndex = activeStep - 1;
  const activeStepObject = ONBOARDING_STEPS[activeStepIndex];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stepper
        activeStep={activeStepIndex}
        alternativeLabel
        sx={{
          width: "80%",
          position: "fixed",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      >
        {ONBOARDING_STEPS.map((stepData) => (
          <Step key={stepData.id}>
            <StepLabel>{stepData.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack justifyContent="space-between" flexGrow={1} marginTop={14}>
        <Box>
          <Typography variant="h4" textAlign="center" gutterBottom>
            {activeStepObject.description}
          </Typography>
        </Box>

        {children}
      </Stack>
    </Box>
  );
};

export default StepsLayout;
