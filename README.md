# AMIRANDA EMPIRE

Application web professionnelle d’AMIRANDA EMPIRE pour piloter progressivement les propriétaires, biens, locataires, contrats, loyers et paiements.

## État du projet

La Phase 2 fournit le socle technique, le schéma PostgreSQL multi-organisations, les clients Supabase SSR et les types TypeScript générés. Le seed de démonstration reste réservé au développement et n’est pas injecté automatiquement dans le projet hébergé.

## Stack

- Next.js 16 avec App Router et React Server Components
- React 19 et TypeScript strict
- Tailwind CSS 4 et shadcn/ui (Radix)
- Geist et Lucide Icons
- Zod pour la validation de configuration
- Vitest et Testing Library pour les tests unitaires
- Supabase PostgreSQL 17, Auth, Storage et clients SSR

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

Les clients Supabase utilisent une clé publishable. Les politiques RBAC et les parcours d’authentification seront implémentés en Phase 3 ; jusque-là, toutes les tables exposées restent fermées par RLS et sans droits `anon`/`authenticated`.

## Scripts

```bash
pnpm lint       # Analyse ESLint
pnpm typecheck  # Vérification TypeScript
pnpm test       # Tests unitaires
pnpm build      # Build de production
pnpm db:reset   # Rejoue migrations et seed sur Supabase local
pnpm db:test    # Exécute les tests pgTAP locaux
pnpm db:types   # Régénère les types depuis le projet hébergé
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

## Base de données

Les migrations versionnées sont dans `supabase/migrations`. Elles créent 26 tables métier, deux vues calculées, cinq buckets privés, les contraintes d’intégrité, les index de clés étrangères et un verrou empêchant la suppression physique des écritures financières.

Le fichier `supabase/seed.sql` est volontairement vide : toutes les données sont créées depuis l’application authentifiée.

## Déploiement

Le dépôt cible est [LabuluDanny9/Gestion_Locative](https://github.com/LabuluDanny9/Gestion_Locative). Le projet Vercel devra être lié localement avant tout déploiement ou synchronisation de variables d’environnement.
