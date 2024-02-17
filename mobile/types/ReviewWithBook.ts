import { Book, Review } from "@ursula/shared-types/derived.ts";

export default interface ReviewWithBook {
  review: Review;
  book: Book;
}
