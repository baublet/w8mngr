import algoliasearch from "algoliasearch";

import { config } from "../config/config";
import { log } from "../config/log";

type AlgoliaService = {
  readonly isLive: boolean;
  getIndex: (indexName: string) => Promise<{
    upsertObjects: (
      objects: { id: string; [key: string]: any }[]
    ) => Promise<void>;
    searchObjects: <T extends Record<string, any>>(
      searchTerm: string,
      filters?: string
    ) => Promise<T[]>;
  }>;
};

export function algoliaService(): () => AlgoliaService {
  if (config.get("ALGOLIA_APPLICATION_ID") === "") {
    log(
      "warn",
      "ALGOLIA_APPLICATION_ID is not set, Algolia search will not work"
    );
    return () => stubAlgoliaService;
  }

  if (config.get("ALGOLIA_ADMIN_API_KEY") === "") {
    log(
      "warn",
      "ALGOLIA_ADMIN_API_KEY is not set, Algolia search will not work"
    );
    return () => stubAlgoliaService;
  }

  const client = algoliasearch(
    config.get("ALGOLIA_APPLICATION_ID"),
    config.get("ALGOLIA_ADMIN_API_KEY")
  );

  return () => ({
    isLive: true,
    getIndex: async (indexName: string) => {
      const index = client.initIndex(indexName);
      return {
        upsertObjects: async (objects) => {
          const formattedObjects = objects.map((obj) => ({
            ...obj,
            objectID: obj.id,
          }));
          await index.saveObjects(formattedObjects);
        },
        searchObjects: async (searchString: string, filters?: string) => {
          try {
            const foundObjects = await index.search(searchString, {
              filters,
            });
            return foundObjects.hits as any;
          } catch (error) {
            log("error", "Error upserting records to Algolia", {
              error,
            });
            return [];
          }
        },
      };
    },
  });
}

const stubAlgoliaService: AlgoliaService = {
  isLive: false,
  getIndex: async () => {
    return {
      upsertObjects: async () => {},
      searchObjects: async () => [],
    };
  },
};
