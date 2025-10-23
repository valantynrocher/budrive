"use client";
import { fuelOptions, yearsOptions, minYear } from "./fieldOptions";
import { getModelsByMake, makes } from "@/data/makes-models";
import {
  FuelType,
  type OnboardingStep1Dto,
  OnboardingStep1Schema,
} from "@budrive/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import step1ServerAction from "./step1ServerAction";

const FRENCH_PLATE_REGEX =
  /^(?:[A-Z]{2}-\d{3}-[A-Z]{2}|(?:\d{1,4}-[A-Z]{1,3}-\d{2}))$/i;

const Step1FormComponent = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStep1Dto>({
    resolver: zodResolver(OnboardingStep1Schema),
    mode: "onBlur",
    defaultValues: {
      make: "",
      model: "",
      licensePlate: "",
      mileage: 0,
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
    // Si la marque change, ou si le modèle sélectionné n'est plus valide
    // dans les nouvelles options, on réinitialise le modèle à vide.
    const currentModelValue = getValues("model"); // Accès direct à la valeur
    if (
      !selectedMake ||
      (currentModelValue && !modelOptions.includes(currentModelValue as string))
    ) {
      setValue("model", "");
    }
  }, [selectedMake, setValue, modelOptions, control]);

  const onSubmit = async (data: FormData) => {
    await step1ServerAction(data);
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
        <FormControl>
          <FormLabel htmlFor="email">Nom</FormLabel>
          <TextField
            type="email"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            color={Boolean(errors.name) ? "error" : "primary"}
            //
            variant="outlined"
            autoComplete="name"
            autoFocus
            fullWidth
            placeholder="Ma Peugeot"
          />
        </FormControl>

        <Controller
          name="make"
          control={control}
          rules={{ required: "La marque est obligatoire" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.make}>
              <InputLabel id="make-label">Marque</InputLabel>
              <Select
                {...field}
                labelId="make-label"
                label="Marque"
                value={field.value || ""}
                displayEmpty
              >
                {makes.map((make) => (
                  <MenuItem key={make} value={make}>
                    {make}
                  </MenuItem>
                ))}
              </Select>
              {errors.make && (
                <FormHelperText>{errors.make.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="model"
          control={control}
          // Validation conditionnelle : le modèle est requis SEULEMENT si une marque est sélectionnée
          rules={{
            required: selectedMake ? "Le modèle est obligatoire" : false,
          }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.model}>
              <InputLabel id="model-label">
                {!selectedMake ? "Sélectionnez d'abord une marque" : "Modèle"}
              </InputLabel>
              <Select
                {...field}
                labelId="model-label"
                label="Modèle"
                value={field.value || ""}
                disabled={!selectedMake} // 👈 DÉSACTIVATION
                displayEmpty
              >
                {modelOptions.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
              {errors.model && (
                <FormHelperText>{errors.model.message}</FormHelperText>
              )}
              {!selectedMake && (
                <FormHelperText>
                  Sélectionnez une marque pour activer les modèles.
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="licensePlate"
          control={control}
          rules={{
            required: "L'immatriculation est obligatoire",
            pattern: {
              value: FRENCH_PLATE_REGEX,
              message: "Le format doit être AA-123-BB ou 123-AA-12.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Immatriculation"
              variant="outlined"
              fullWidth
              // MUI gère l'état d'erreur via les props error et helperText
              error={!!errors.licensePlate}
              helperText={
                errors.licensePlate
                  ? errors.licensePlate.message
                  : "Ex: AA-123-BB ou 123-AB-45"
              }
              slotProps={{
                htmlInput: { style: { textTransform: "uppercase" } },
              }}
            />
          )}
        />

        <Controller
          name="yearOfCirculation"
          control={control}
          rules={{ required: "L'année de mise en circulation est obligatoire" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.yearOfCirculation}>
              <InputLabel id="year-label">Année de Circulation</InputLabel>
              <Select
                {...field}
                labelId="year-label"
                label="Année de Circulation"
                value={field.value}
                displayEmpty
              >
                {yearsOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {errors.yearOfCirculation && (
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
          rules={{ required: "Le type de carburant est obligatoire" }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.fuelType}>
              <InputLabel id="fuel-label">Type de Carburant</InputLabel>
              <Select
                {...field}
                labelId="fuel-label"
                label="Type de Carburant"
                value={field.value}
                displayEmpty
              >
                {fuelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.fuelType && (
                <FormHelperText>{errors.fuelType.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

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
    </>
  );
};

export default Step1FormComponent;
