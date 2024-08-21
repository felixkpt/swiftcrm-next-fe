import { ActionListType, KnownActionsType } from "./types";

export const getEndpoint = (
  actionLabels: Partial<ActionListType>, 
  record: any, 
  recordEndpoint: string, 
  actionKey: KnownActionsType
): string | null => {

  // Ensure the required values are available
  if (record?.id && actionLabels[actionKey]?.slug) {
    // Replace '{id}' placeholder in the endpoint with record.id
    const resolved = `/${recordEndpoint.replace('{id}', record.id)}`;
    const slug = actionLabels[actionKey].slug;

    // Return the endpoint with the slug if available
    return `${resolved}/${slug}`.replace(/\/+/g, '/');
  }

  // Fallback if conditions aren't met
  return null;
};
