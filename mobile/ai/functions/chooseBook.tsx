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
  let bookName = book;
  // TODO: when search includes authors we can rm this
  if (bookName.includes(" by ")) {
    bookName = bookName.split(" by ")[0];
  }
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
