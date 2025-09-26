import { z } from "zod/v4";
import fr from "zod/v4/locales/fr.js";

z.config(fr());

export const emailSchema = z.email("Adresse email invalide");
export type EmailValue = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(6, "Au moins 6 caractères"),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  });
export type PasswordValues = z.infer<typeof passwordSchema>;

export const authDataSchemaBase = z.object({
  email: emailSchema,
  password: passwordSchema.shape.password,
});

export default z;
