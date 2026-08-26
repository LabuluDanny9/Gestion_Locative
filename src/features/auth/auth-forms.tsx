"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  loginAction,
  requestPasswordResetAction,
  updatePasswordAction,
  updateProfileAction,
} from "./actions";
import { initialAuthActionState } from "./state";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: typeof initialAuthActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <Alert variant={state.status === "error" ? "destructive" : "default"}>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}

function SubmitButton({ children, pending }: { children: React.ReactNode; pending: boolean }) {
  return (
    <Button className="h-10 w-full" disabled={pending} type="submit">
      {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialAuthActionState);

  return (
    <form action={action} className="space-y-5">
      <input name="next" type="hidden" value={nextPath ?? "/espace"} />
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <div className="relative">
          <Mail aria-hidden="true" className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            autoComplete="email"
            className="h-10 pl-9"
            id="email"
            name="email"
            placeholder="nom@entreprise.cd"
            required
            type="email"
          />
        </div>
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Mot de passe</Label>
          <Link className="text-xs font-medium text-primary hover:underline" href="/mot-de-passe-oublie">
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole aria-hidden="true" className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            autoComplete="current-password"
            className="h-10 pl-9"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      <SubmitButton pending={pending}>Se connecter</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    initialAuthActionState,
  );

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail du compte</Label>
        <Input autoComplete="email" className="h-10" id="email" name="email" required type="email" />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <SubmitButton pending={pending}>Envoyer le lien sécurisé</SubmitButton>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initialAuthActionState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input autoComplete="new-password" className="h-10" id="password" name="password" required type="password" />
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="passwordConfirmation">Confirmer le mot de passe</Label>
        <Input
          autoComplete="new-password"
          className="h-10"
          id="passwordConfirmation"
          name="passwordConfirmation"
          required
          type="password"
        />
        <FieldError errors={state.fieldErrors?.passwordConfirmation} />
      </div>
      <SubmitButton pending={pending}>Enregistrer le mot de passe</SubmitButton>
    </form>
  );
}

type ProfileFormProps = {
  profile: {
    display_name: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfileAction, initialAuthActionState);

  return (
    <form action={action} className="space-y-5">
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="displayName">Nom affiché</Label>
        <Input className="h-10" defaultValue={profile.display_name} id="displayName" name="displayName" required />
        <FieldError errors={state.fieldErrors?.displayName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input className="h-10" defaultValue={profile.first_name ?? ""} id="firstName" name="firstName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input className="h-10" defaultValue={profile.last_name ?? ""} id="lastName" name="lastName" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input className="h-10" defaultValue={profile.phone ?? ""} id="phone" name="phone" type="tel" />
        <FieldError errors={state.fieldErrors?.phone} />
      </div>
      <SubmitButton pending={pending}>Enregistrer le profil</SubmitButton>
    </form>
  );
}
