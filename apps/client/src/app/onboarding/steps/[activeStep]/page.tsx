import Step1 from "@/app/onboarding/steps/[activeStep]/step1";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ activeStep: string }>;
}) => {
  await params;
  const activeStep = parseInt((await params).activeStep);

  const stepComponentMatcher: { [key: number]: React.ComponentType<any> } = {
    1: Step1,
  };

  const MatchedComponent = stepComponentMatcher[activeStep];

  return MatchedComponent ? <MatchedComponent /> : null;
};

export default page;
