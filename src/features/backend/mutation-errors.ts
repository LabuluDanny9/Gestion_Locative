import { z } from "zod";

function errorText(cause: unknown) {
  if (cause instanceof Error) return cause.message;
  if (!cause || typeof cause !== "object") return "";

  const error = cause as Record<string, unknown>;
  return [error.code, error.message, error.details, error.hint]
    .filter((part): part is string => typeof part === "string")
    .join(" ");
}

export function mutationMessage(cause: unknown) {
  if (cause instanceof z.ZodError) return "Vérifiez les champs obligatoires et leur format.";

  const message = errorText(cause);
  if (message.includes("Photo invalide") || message.includes("Document invalide") || message.includes("Montant supérieur")) return message;
  if (/TextBee|WhatsApp|textbee|meta_whatsapp_cloud|Numéro de téléphone invalide/i.test(message)) return message.slice(0, 500);
  if (/duplicate|unique|23505/i.test(message)) return "Une donnée avec la même référence existe déjà.";
  if (/foreign key|23503/i.test(message)) return "Ce locataire possède encore un contrat, un paiement ou une intervention liée. Supprimez ou clôturez d’abord ces éléments.";
  if (/permission|42501/i.test(message)) return "Votre compte ne possède pas l’autorisation requise.";
  if (/PGRST202|schema cache|Could not find the function/i.test(message)) return "Le service de création du contrat est indisponible. Actualisez la page puis réessayez.";
  if (/Invalid lease payload|22023/i.test(message)) return "Vérifiez les informations du contrat puis réessayez.";
  return "Une erreur inattendue est survenue. Réessayez.";
}
