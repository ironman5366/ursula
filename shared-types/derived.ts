import { Database } from "@ursula/shared-types/Database.ts";

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Edition = Database["public"]["Tables"]["editions"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type ReadingListItem =
  Database["public"]["Tables"]["reading_list_items"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
