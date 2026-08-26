# Design system — Gestion Locative

## Principes

- Ton visuel : premium, moderne, rassurant, lumineux et sobre.
- Police : Geist pour l’interface, Geist Mono pour les identifiants techniques.
- Grille : base de 4 px, espacements usuels de 8, 12, 16, 24, 32 et 48 px.
- Rayons : 8 px pour les contrôles, 12 px pour les cartes et dialogues.
- Animations : 150 à 250 ms, avec prise en charge de `prefers-reduced-motion` par les primitives.

## Couleurs

| Rôle | Valeur | Usage |
| --- | --- | --- |
| Navy 950 | `#0F172A` | Sidebar, texte majeur |
| Navy 900 | `#172554` | Action primaire, surfaces fortes |
| Blue 600 | `#2563EB` | Action et accent fonctionnel |
| Blue 500 | `#3B82F6` | Focus et sélection |
| Gold 500 | `#D4A72C` | Accent premium rare |
| Surface | `#F7F8FC` | Fond d’application clair |

Les statuts associent toujours couleur, icône et libellé. Le thème sombre conserve les mêmes rôles sémantiques avec des contrastes adaptés.

## Hiérarchie

- Titre de page : 28–32 px, semi-gras.
- Titre de section : 18–22 px, semi-gras.
- Valeur KPI : 28–36 px, chiffres tabulaires.
- Corps : 14–16 px, interligne confortable.
- Libellé secondaire : 12–14 px, couleur atténuée.

## Shell

- Desktop : sidebar de 272 px, repliable à 80 px.
- Tablette : sidebar compacte de 80 px avec tooltips.
- Mobile : drawer latéral, header compact et quatre raccourcis bas maximum.
- Topbar : contexte courant, recherche globale, création rapide, notifications, aide, thème et profil.
- Les modules non encore livrés sont explicitement désactivés ; aucun lien mort n’est présenté comme fonctionnel.

## Accessibilité

- Navigation clavier et focus visible sur chaque contrôle interactif.
- Libellés accessibles sur les boutons icônes et champs de recherche.
- Contraste cible WCAG AA.
- Zones tactiles principales de 40 à 44 px.
- États vide, chargement et erreur prévus pour chaque futur écran métier.

La référence visuelle exécutable est disponible sur `/design-system`.
