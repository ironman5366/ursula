import React from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { fetchSearchBooksOnly } from "../../hooks/useSearch.ts";
import { Text } from "react-native";
import { FunctionRenderProps } from "./bindings.ts";
import BookPreviewRow from "../../components/molecules/BookPreview/Row.tsx";
import BookPreviewCard from "../../components/molecules/BookPreview/Card.tsx";

export const CHOOSE_BOOK_FUNCTION: LLM.Function = {
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
}): Promise<Book | null> {
  const results = await fetchSearchBooksOnly(book);
  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
}

export function BookChoice({
  input,
  result,
}: FunctionRenderProps<{ book: string }, Book | null>) {
  if (result) {
    return <BookPreviewCard book={result} />;
  } else {
    return <Text>No book found for {input.book}</Text>;
  }
}
