import React from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { fetchSearchBooksOnly } from "../../hooks/useSearch.ts";
import { Text, View } from "react-native";
import { FunctionRenderProps } from "./bindings.ts";
import { BookPreviewLinkCard } from "../../components/molecules/BookPreview/Link.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";

export const CHOOSE_BOOK_FUNCTION: LLM.Function = {
  name: "choose_book",
  description:
    "Provide the name of a book, optionall including its author. For example " +
    "choose_book(book='The Great Gatsby') or choose_book(book='The Great Gatsby', author='F. Scott Fitzgerald')",
  parameters: {
    type: "object",
    properties: {
      book: {
        type: "string",
      },
      author: {
        type: "string",
      },
      required: ["book"],
    },
  },
};

export async function chooseBook({
  book,
  author,
}: {
  book: string;
  author?: string;
}): Promise<Book | null> {
  console.log(book, author);
  let query = book;
  if (author) {
    query += " " + author;
  }
  console.log("Choosing book", query);
  const results = await fetchSearchBooksOnly(query);
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
    return <BookPreviewLinkCard book={result} />;
  } else {
    return (
      <StyledView
        style={{
          alignSelf: "center",
          maxWidth: "80%",
        }}
      >
        <Text>Not found: "{input.book}"</Text>
      </StyledView>
    );
  }
}
