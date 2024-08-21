import { appConfig } from "./helpers";

/**
 * Fetches records from the given API endpoint based on provided parameters.
 * 
 * @param {string} apiEndpoint - The API endpoint to fetch records from.
 * @param {object} params - Query parameters to include in the request.
 * @returns {Promise<any[]>} - An array of records fetched from the API.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchOptions = async (
  apiEndpoint: string,
  params: object
): Promise<any[]> => {
  'use server'
  try {
    const queryParams = new URLSearchParams({ per_page: '50', ...params }).toString();
    
    const tags = [apiEndpoint, `${appConfig.api.url(apiEndpoint)}?${queryParams}`]

    const response = await fetch(apiEndpoint, { next: { tags: [...tags, apiEndpoint] } });

    if (!response.ok) throw new Error('Failed to fetch options');

    const data = await response.json();
    return data.records || data || [];

  } catch (error: any) {
    console.error('An error occurred while fetching options:', error);
    throw error;
  }
};

export default fetchOptions;
