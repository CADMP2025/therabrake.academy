import { MeiliSearch } from 'meilisearch';

if (!process.env.NEXT_PUBLIC_MEILISEARCH_HOST) {
  throw new Error('NEXT_PUBLIC_MEILISEARCH_HOST is not defined');
}

if (!process.env.MEILISEARCH_MASTER_KEY) {
  throw new Error('MEILISEARCH_MASTER_KEY is not defined');
}

// Server-side client with master key
export const meiliServerClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

// Client-side safe client (use in API routes that return to frontend)
export const meiliPublicClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY!,
});

export const COURSES_INDEX = 'courses';
