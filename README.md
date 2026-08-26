# Gestion Locative

Application web professionnelle de gestion locative pour piloter progressivement les propriétaires, biens, locataires, contrats, loyers et paiements.

## État du projet

La Phase 1 fournit le socle technique et visuel. Aucune donnée métier n’est simulée et aucune migration de base de données n’est exécutée à ce stade.

## Stack

- Next.js 16 avec App Router et React Server Components
- React 19 et TypeScript strict
- Tailwind CSS 4 et shadcn/ui (Radix)
- Geist et Lucide Icons
- Zod pour la validation de configuration
- Vitest et Testing Library pour les tests unitaires

## Installation

Prérequis : Node.js 24 et pnpm 11.

```bash
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Le projet sera disponible sur `http://localhost:3000`.

## Variables d’environnement

Copier `.env.example` vers `.env.local`, puis compléter les valeurs dans un gestionnaire de secrets. Seules les variables préfixées par `NEXT_PUBLIC_` peuvent être intégrées au code envoyé au navigateur. `SUPABASE_SECRET_KEY` doit rester exclusivement côté serveur.

La connexion Supabase et l’authentification seront implémentées en Phase 2.

## Scripts

```bash
pnpm lint       # Analyse ESLint
pnpm typecheck  # Vérification TypeScript
pnpm test       # Tests unitaires
pnpm build      # Build de production
```

## Architecture

```text
src/
├── app/          # Routes, layouts et états Next.js
├── components/   # Design system et composants partagés
├── config/       # Configuration applicative
├── features/     # Domaines métier, un dossier par fonctionnalité
├── lib/          # Utilitaires et validation d’environnement
└── services/     # Adaptateurs vers les services externes
supabase/
├── migrations/
├── seed/
└── tests/
tests/
├── integration/
└── e2e/
```

## Déploiement

Le dépôt cible est [LabuluDanny9/Gestion_Locative](https://github.com/LabuluDanny9/Gestion_Locative). Le projet Vercel devra être lié localement avant tout déploiement ou synchronisation de variables d’environnement.
