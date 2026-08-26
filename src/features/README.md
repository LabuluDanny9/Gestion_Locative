# Fonctionnalités

Chaque domaine métier possède son propre dossier afin de garder ensemble son interface, ses validations, ses requêtes et ses tests.

Convention prévue :

```text
features/<domaine>/
├── components/
├── schemas/
├── server/
├── types.ts
└── *.test.ts(x)
```

Les domaines seront introduits progressivement : authentification, propriétaires, biens, locataires, contrats, loyers et paiements.
