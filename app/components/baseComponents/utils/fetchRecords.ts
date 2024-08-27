import { getModelTag } from "./helpers";

// Define TypeScript types for the results
interface FetchRecordsResponse {
  records: any[];
  metadata: object | null;
}

/**
 * Fetches records from the given API endpoint with optional cache tags.
 * 
 * @param {string} apiEndpoint - The API endpoint to fetch records from.
 * @param {Array<string>} [tags=[]] - Optional cache tags to associate with the fetch request. This can be used for cache management.
 * @returns {FetchRecordsResponse} - An object containing:
 *   - {Array} records - The list of records fetched from the API.
 *   - {Object|null} metadata - Metadata associated with the records, or null if not present.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
const fetchRecords = async (apiEndpoint: string, tags: string[] = []): Promise<FetchRecordsResponse> => {
  let records: any[] = [];
  let metadata: object | null = null;

  try {

    const tags = [getModelTag(apiEndpoint)]

    const response = await fetch(apiEndpoint + '?source=NextBackend', { next: { tags } });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiEndpoint}`);
    }

    const data = await response.json();
    const hasMetadata = typeof data?.metadata !== 'undefined';

    if (hasMetadata) {
      metadata = data.metadata;
      records = data.records || [];
    } else {
      records = data || [];
    }
  } catch (error) {
    console.error(`Error fetching records:`, error);
    throw error;
  }

  return { records, metadata };
};

export default fetchRecords;
