export const OnboardingErrors = {
  MAKE_REQUIRED: "La marque est obligatoire",
  MODEL_REQUIRED: "Le modèle est obligatoire",
  SELECT_MAKE_FIRST: "Sélectionnez d'abord une marque",
  LICENSE_PLATE_INVALID: "Le format doit être AA-123-BB ou 123-AA-12",
  MILEAGE_MINIMUM_VALUE: "Le kilométrage minimal est de 1",
  YEAR_CIRCULATION_INVALID:
    "L'année doit être comprise entre 2005 et l'année en cours",
  STEP_UNKNOW_ERROR:
    "L'enregistrement a échoué. Veuillez réessayer ultérieurement",
  PURCHASE_DATE_INVALID:
    "La date d'achat doit être comprise entre le 01/01/2005 et la date du jour",
} as const;
export type OnboardingErrorKey = keyof typeof OnboardingErrors;
