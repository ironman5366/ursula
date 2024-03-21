import { Database } from "./Database.ts";
import { Author, Book, Profile } from "./derived.ts";

type ConditionalEntityId<T extends { id: unknown }> = T["id"] extends number
  ? { entity_id_numeric: number; entity_id_uuid: null }
  : T["id"] extends string
  ? { entity_id_numeric: null; entity_id_uuid: string }
  : never;

type SearchResultBase<
  T extends keyof Database["public"]["Tables"],
  F extends keyof Database["public"]["Tables"][T]["Row"],
  C extends Database["public"]["Tables"][T]["Row"] & { id: unknown }
> = ConditionalEntityId<C> & {
  result_field: F;
  entity_type: T;
  search_field: string;
  order_key: number;
};

export type BookSearchResult = SearchResultBase<"books", any, Book>;
export type AuthorSearchResult = SearchResultBase<"authors", any, Author>;
export type ProfileSearchResult = SearchResultBase<"profiles", any, Profile>;

/**
 * Example:
 * { entity_id_numeric: 1, entity_id_uuid: never, result_field: "title", result_type: "books", search_field: "Gone with the Wind", order_key: 3 }
 */
export type SearchResult =
  | SearchResultBase<"books", "title", Book>
  | SearchResultBase<"authors", "name", Author>
  | SearchResultBase<"profiles", "username", Profile>;
