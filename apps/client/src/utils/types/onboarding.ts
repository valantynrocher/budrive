export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  endpoint?: string;
  isOptional?: boolean;
}
