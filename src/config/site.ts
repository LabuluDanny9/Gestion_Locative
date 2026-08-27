export const siteConfig = {
  name: "AMIRANDA EMPIRE",
  shortName: "AE",
  description:
    "La plateforme immobilière d’AMIRANDA EMPIRE pour piloter les biens, contrats, loyers et encaissements.",
  locale: "fr-CD",
  timezone: "Africa/Lubumbashi",
  currencies: ["USD", "CDF"],
  url:
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  repositoryUrl: "https://github.com/LabuluDanny9/Gestion_Locative",
  links: {
    github: "https://github.com/LabuluDanny9/Gestion_Locative",
  },
} as const;

export type AppCurrency = (typeof siteConfig.currencies)[number];
