const formatRegistration = (input: string): typeof input => {
  const firstPart = input.slice(0, 2);
  const secondPart = input.slice(2, 5);
  const lastPart = input.slice(5);

  return firstPart + "-" + secondPart + "-" + lastPart;
};

export { formatRegistration };
