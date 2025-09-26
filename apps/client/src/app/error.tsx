"use client";

const Error = ({ error }: { error: Error; reset: () => void }) => {
  return <div className="">{error.message}</div>;
};

export default Error;
