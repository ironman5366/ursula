import { Database } from "@ursula/shared-types/Database.ts";
import { ActivityData } from "./Activity.ts";

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Edition = Database["public"]["Tables"]["editions"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type ReadingListItem =
  Database["public"]["Tables"]["reading_list_items"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Genre = Database["public"]["Tables"]["genres"]["Row"];

// We pull these fields out so we can specify them with better defined types
export type BaseActivity = Omit<
  Database["public"]["Tables"]["activities"]["Row"],
  "data" | "activity_type"
>;
export type Activity = BaseActivity & ActivityData;

export type ActivityOf<T extends ActivityData> = BaseActivity & T;
