import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Saisissez une adresse e-mail valide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  next: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Saisissez une adresse e-mail valide."),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Utilisez au moins 10 caractères.")
      .regex(/[A-Z]/, "Ajoutez au moins une lettre majuscule.")
      .regex(/[a-z]/, "Ajoutez au moins une lettre minuscule.")
      .regex(/[0-9]/, "Ajoutez au moins un chiffre."),
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirmation"],
  });

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Le nom affiché est requis.").max(100),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^\+?[0-9 ()-]*$/, "Le numéro de téléphone n’est pas valide.")
    .optional(),
});
