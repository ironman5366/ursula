import LLM from "@ursula/shared-types/llm.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { fetchSearchResults } from "../../hooks/useSearch.ts";
import { BookSearchResult } from "@ursula/shared-types/SearchResult.ts";

const CHOOSE_BOOK_FUNCTION: LLM.Function = {
  name: "choose_book",
  description:
    "Provide the name of a book, for example choose_book('Gone with the wind')",
  parameters: {
    type: "object",
    properties: {
      book: {
        type: "string",
      },
      required: ["book"],
    },
  },
};

export async function chooseBook({
  book,
}: {
  book: string;
}): Promise<BookSearchResult | null> {
  const results = await fetchSearchResults(book);
  const bookResults = results.filter(
    (result) => result.entity_type === "books"
  );

  if (bookResults.length > 0) {
    return bookResults.sort(
      (a, b) => a.order_key - b.order_key
    )[0] as BookSearchResult;
  } else {
    return null;
  }
}
