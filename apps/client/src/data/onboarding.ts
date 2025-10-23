import { OnboardingStep } from "@/utils/types/onboarding";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Identification du véhicule",
    description: "Donnez-nous les informations de base sur votre véhicule",
    endpoint: "/onboarding/step-1",
  },
  {
    id: 2,
    title: "Votre véhicule et vous",
    description: "Dites nous tout sur l'achat de votre véhicule",
    endpoint: "/onboarding/step-2",
  },
  {
    id: 3,
    title: "Assurance",
    description: "Configurez votre contrat d'assurance",
    endpoint: "/onboarding/step-3",
  },
  {
    id: 4,
    title: "Confirmation",
    description: "Récapitulatif",
    endpoint: "/onboarding/complete",
  },
];

export const ONBOARDING_CONFIG = {
  steps: ONBOARDING_STEPS,
  totalSteps: ONBOARDING_STEPS.length,
} as const;
