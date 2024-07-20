// Define TypeScript types for the results
interface FetchRecordsResponse {
  records: any[]; // Adjust the type if you have a specific record structure
  metadata: object | null; // Adjust the type if you have a specific metadata structure
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
  let records: any[] = []; // Adjust the type if you have a specific record structure
  let metadata: object | null = null; // Adjust the type if you have a specific metadata structure

  try {
    const response = await fetch(apiEndpoint, { next: { tags } });

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
