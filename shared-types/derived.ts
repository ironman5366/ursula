import { Database } from "@ursula/shared-types/Database.ts";

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type UpdateReview = Database["public"]["Tables"]["reviews"]["Update"];

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Edition = Database["public"]["Tables"]["editions"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type ReadingListItem =
  Database["public"]["Tables"]["reading_list_items"]["Row"];
