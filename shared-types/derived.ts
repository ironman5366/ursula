import { Database } from "@ursula/shared-types/Database.ts";

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type UpdateReview = Database["public"]["Tables"]["reviews"]["Update"];

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
