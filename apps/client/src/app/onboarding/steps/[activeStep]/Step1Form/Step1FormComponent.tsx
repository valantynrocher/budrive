"use client";
import ErrorSnackbar from "@/components/ui/ErrorSnackbar";
import { getModelsByMake, makes } from "@/data/makes-models";
import {
  type OnboardingStep1Dto,
  OnboardingStep1Schema,
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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { fuelOptions, yearsOptions } from "./fieldOptions";
import step1ServerAction from "./step1ServerAction";

const Step1FormComponent = () => {
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(OnboardingStep1Schema),
    mode: "onBlur",
    defaultValues: {
      make: "",
      model: "",
      licensePlate: "",
      mileage: 1,
      yearOfCirculation: "" as any,
      fuelType: "" as any,
    },
  });

  const selectedMake = useWatch({
    control,
    name: "make",
  });

  const modelOptions = selectedMake ? getModelsByMake(selectedMake) : [];

  useEffect(() => {
    const currentModelValue = getValues("model"); // Accès direct à la valeur
    if (
      !selectedMake ||
      (currentModelValue && !modelOptions.includes(currentModelValue as string))
    ) {
      setValue("model", "");
    }
  }, [selectedMake, setValue, modelOptions, control]);

  const onSubmit: SubmitHandler<OnboardingStep1Dto> = async (formData) => {
    setFetchError(null);

    const nextFetchError = await step1ServerAction(formData);

    if (nextFetchError) {
      setFetchError(nextFetchError);
    }
  };

  const handleErrorClose = () => {
    setFetchError(null);
  };

  return (
    <>
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
            name="name"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <TextField
                {...field}
                label="Nom"
                variant="outlined"
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.name}
                helperText={
                  (isDirty || isSubmitted) && errors.name
                    ? errors.name.message
                    : undefined
                }
                placeholder="Ma Peugeot"
              />
            )}
          />

          <Controller
            name="licensePlate"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <TextField
                {...field}
                label="Immatriculation"
                variant="outlined"
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.licensePlate}
                helperText={
                  (isDirty || isSubmitted) && errors.licensePlate
                    ? errors.licensePlate.message
                    : undefined
                }
                slotProps={{
                  htmlInput: { style: { textTransform: "uppercase" } },
                }}
              />
            )}
          />
        </Stack>

        <Stack spacing={2} direction="row">
          <Controller
            name="make"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <FormControl
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.make}
              >
                <InputLabel id="make-label">Marque</InputLabel>
                <Select {...field} displayEmpty>
                  {makes.map((make) => (
                    <MenuItem key={make} value={make}>
                      {make}
                    </MenuItem>
                  ))}
                </Select>
                {(isDirty || isSubmitted) && errors.make && (
                  <FormHelperText>{errors.make.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="model"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <FormControl
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.model}
                disabled={!selectedMake}
              >
                <InputLabel id="model-label">Modèle</InputLabel>
                <Select {...field} disabled={!selectedMake} displayEmpty>
                  {modelOptions.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
                {(isDirty || isSubmitted) && errors.model && (
                  <FormHelperText>{errors.model.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>

        <Stack spacing={2} direction="row">
          <Controller
            name="yearOfCirculation"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <FormControl
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.yearOfCirculation}
              >
                <InputLabel id="year-label">Année de Circulation</InputLabel>
                <Select {...field} displayEmpty>
                  {yearsOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                {(isDirty || isSubmitted) && errors.yearOfCirculation && (
                  <FormHelperText>
                    {errors.yearOfCirculation.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="fuelType"
            control={control}
            render={({ field, fieldState: { isDirty } }) => (
              <FormControl
                fullWidth
                error={(isDirty || isSubmitted) && !!errors.fuelType}
              >
                <InputLabel id="fuel-label">Type de Carburant</InputLabel>
                <Select {...field} displayEmpty>
                  {fuelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {(isDirty || isSubmitted) && errors.fuelType && (
                  <FormHelperText>{errors.fuelType.message}</FormHelperText>
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
          <Link href="/onboarding">
            <Button variant="outlined" color="secondary">
              Précédent
            </Button>
          </Link>
          <Button variant="contained" type="submit" color="primary">
            Suivant
          </Button>
        </Stack>
      </Box>

      <ErrorSnackbar message={fetchError} onClose={handleErrorClose} />
    </>
  );
};

export default Step1FormComponent;
