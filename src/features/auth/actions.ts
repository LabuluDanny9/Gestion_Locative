"use server";

import { redirect } from "next/navigation";

import { parseServerEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import {
  loginSchema,
  profileSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "./schemas";
import type { AuthActionState } from "./state";

function invalidState(error: { flatten(): { fieldErrors: Record<string, string[]> } }) {
  return {
    status: "error" as const,
    message: "Vérifiez les informations saisies.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function safeNextPath(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/espace";
}

function optionalValue(value?: string) {
  return value?.trim() ? value.trim() : null;
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) return invalidState(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      status: "error",
      message: "Connexion impossible. Vérifiez vos identifiants ou contactez un administrateur.",
    };
  }

  redirect(safeNextPath(parsed.data.next));
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return invalidState(parsed.error);

  const environment = parseServerEnv();
  const appUrl = environment.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createServerSupabaseClient();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: new URL("/auth/confirm?next=/modifier-mot-de-passe", appUrl).toString(),
  });

  return {
    status: "success",
    message:
      "Si ce compte existe, un lien sécurisé vient d’être envoyé à cette adresse.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });
  if (!parsed.success) return invalidState(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: "error", message: "Le mot de passe n’a pas pu être modifié." };
  }

  redirect("/espace?mot-de-passe=modifie");
}

export async function updateProfileAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    firstName: formData.get("firstName") || undefined,
    lastName: formData.get("lastName") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return invalidState(parsed.error);

  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { status: "error", message: "Votre session a expiré. Reconnectez-vous." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      first_name: optionalValue(parsed.data.firstName),
      last_name: optionalValue(parsed.data.lastName),
      phone: optionalValue(parsed.data.phone),
    })
    .eq("id", userData.user.id);

  if (error) {
    return { status: "error", message: "Le profil n’a pas pu être enregistré." };
  }

  return { status: "success", message: "Profil mis à jour." };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
