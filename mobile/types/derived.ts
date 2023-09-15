import { Database } from "./Database";

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

type WithoutUser<T> = Omit<T, "user_uid">;

export type InsertReview = WithoutUser<
  Database["public"]["Tables"]["reviews"]["Insert"]
>;

export type UpdateReview = Database["public"]["Tables"]["reviews"]["Update"];

export type Book = Database["public"]["Tables"]["books"]["Row"];

export type Author = Database["public"]["Tables"]["authors"]["Row"];
