import { LayoutProps, WithRouteParamsProps } from "@/utils/types/props";

export type StepParamsProps = WithRouteParamsProps<{ activeStep: string }>;

export type StepsLayoutProps = LayoutProps & StepParamsProps;
