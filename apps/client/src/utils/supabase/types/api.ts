export type SupabaseService =
  | "auth"
  | "storage"
  | "realtime"
  | "database"
  | "functions";

export type TranslationStructure = Record<
  SupabaseService,
  Record<string, string>
>;
