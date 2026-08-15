// Meilisearch 全文搜索封装(中文分词开箱即用)
import { Meilisearch } from "meilisearch";

const INDEX_NAME = "posts";

function getClient() {
  return new Meilisearch({
    host: process.env.MEILISEARCH_URL ?? "http://127.0.0.1:7700",
  });
}

export interface SearchablePost {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  tags: string[];
  category: string | null;
  status: string;
  publishedAt: number;
}

let settingsPromise: Promise<void> | null = null;

export async function ensureIndexSettings(): Promise<void> {
  if (!settingsPromise) {
    settingsPromise = getClient()
      .index(INDEX_NAME)
      .updateSettings({
        searchableAttributes: ["title", "summary", "content", "tags", "category"],
        filterableAttributes: ["status"],
        sortableAttributes: ["publishedAt"],
      })
      .then(() => undefined);
  }
  return settingsPromise;
}

/** 索引单篇文章(仅已发布文章) */
export async function indexPost(post: SearchablePost): Promise<void> {
  await ensureIndexSettings();
  await getClient().index(INDEX_NAME).addDocuments([post]);
}

/** 从索引删除文章 */
export async function deletePostFromIndex(id: string): Promise<void> {
  await getClient().index(INDEX_NAME).deleteDocument(id);
}

/** 全量重建索引 */
export async function rebuildIndex(posts: SearchablePost[]): Promise<void> {
  await ensureIndexSettings();
  await getClient().index(INDEX_NAME).deleteAllDocuments();
  if (posts.length > 0) {
    await getClient().index(INDEX_NAME).addDocuments(posts);
  }
}

export interface SearchHit {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  category: string | null;
  publishedAt: number;
}

export interface SearchResult {
  hits: SearchHit[];
  total: number;
}

export async function searchPosts(
  query: string,
  limit = 20
): Promise<SearchResult> {
  if (!query.trim()) return { hits: [], total: 0 };
  const res = await getClient().index(INDEX_NAME).search(query, {
    limit,
    attributesToHighlight: ["title", "summary"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
    sort: ["publishedAt:desc"],
  });
  const hits: SearchHit[] = (res.hits as Array<
    SearchablePost & {
      _formatted?: { title?: string; summary?: string };
    }
  >).map((h) => ({
    id: h.id,
    slug: h.slug,
    title: h._formatted?.title ?? h.title,
    summary: h._formatted?.summary ?? h.summary,
    tags: h.tags,
    category: h.category,
    publishedAt: h.publishedAt,
  }));
  return { hits, total: res.estimatedTotalHits ?? hits.length };
}
