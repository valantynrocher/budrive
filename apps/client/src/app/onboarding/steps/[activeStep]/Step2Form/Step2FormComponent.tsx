"use client";
import { estimatedMileageOptions } from "@/app/onboarding/steps/[activeStep]/Step2Form/fieldOptions";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import {
  type OnboardingStep2Dto,
  OnboardingStep2Schema,
} from "@budrive/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/fr";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import step2ServerAction from "./step2ServerAction";

const Step2FormComponent = () => {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("v");
  const [snackError, setSnackError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(OnboardingStep2Schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<OnboardingStep2Dto> = async (formData) => {
    setSnackError(null);
    if (!vehicleId) {
      setSnackError(
        "Impossible de soumettre le formulaire, le véhicule est inconnu."
      );
      return;
    }

    const nextFetchError = await step2ServerAction(vehicleId, formData);

    if (nextFetchError) {
      setSnackError(nextFetchError);
    }
  };

  const handleErrorClose = () => {
    setSnackError(null);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack spacing={2} direction="row">
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field, fieldState: { isDirty } }) => (
                <DatePicker
                  label="Date d'achat"
                  format="DD/MM/YYYY"
                  value={field.value as any}
                  onChange={field.onChange}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="purchasePrice"
              control={control}
              render={({ field, fieldState: { isDirty } }) => (
                <TextField
                  {...field}
                  label="Prix d'achat"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={(isDirty || isSubmitted) && !!errors.purchasePrice}
                  helperText={
                    (isDirty || isSubmitted) && errors.purchasePrice
                      ? errors.purchasePrice.message
                      : undefined
                  }
                />
              )}
            />
          </Stack>

          <Stack spacing={2} direction="row">
            <Controller
              name="initialMileage"
              control={control}
              render={({ field, fieldState: { isDirty } }) => (
                <TextField
                  {...field}
                  label="Kilométrage initial"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={(isDirty || isSubmitted) && !!errors.initialMileage}
                  helperText={
                    (isDirty || isSubmitted) && errors.initialMileage
                      ? errors.initialMileage.message
                      : undefined
                  }
                />
              )}
            />
            <Controller
              name="estimatedAnnualMileage"
              control={control}
              render={({ field, fieldState: { isDirty } }) => (
                <FormControl
                  fullWidth
                  error={
                    (isDirty || isSubmitted) && !!errors.estimatedAnnualMileage
                  }
                >
                  <InputLabel>Kilométrage annuel</InputLabel>
                  <Select {...field} displayEmpty>
                    {estimatedMileageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {(isDirty || isSubmitted) &&
                    errors.estimatedAnnualMileage && (
                      <FormHelperText>
                        {errors.estimatedAnnualMileage.message}
                      </FormHelperText>
                    )}
                </FormControl>
              )}
            />
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button variant="contained" type="submit" color="primary">
              Suivant
            </Button>
          </Stack>
        </Box>
      </LocalizationProvider>
      <ErrorSnackbar message={snackError} onClose={handleErrorClose} />
    </>
  );
};

export default Step2FormComponent;
