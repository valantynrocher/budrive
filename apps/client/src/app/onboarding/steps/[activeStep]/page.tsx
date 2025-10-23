import Step1Form from "@/app/onboarding/steps/[activeStep]/Step1Form";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ activeStep: string }>;
}) => {
  await params;
  const activeStep = parseInt((await params).activeStep);

  const stepViewMatcher: { [key: number]: React.FC<any> } = {
    1: Step1Form,
  };

  const MatchedComponent = stepViewMatcher[activeStep];

  return MatchedComponent || null;
};

export default page;
