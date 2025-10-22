import data from "./makes-models.json";

export const makes = Object.keys(data);
export const getModelsByMake = (make: string) =>
  (data as Record<string, string[]>)[make];
