import React from "react";
import { FlatList } from "react-native";
import { Book } from "../../../shared-types/derived";
import { BookPreviewLinkRow } from "./BookPreview/Link.tsx";

interface Props {
  books: Book[];
  replace?: boolean;
}

export default function BookList({ books, replace }: Props) {
  return (
    <FlatList
      style={{
        width: "100%",
      }}
      data={books}
      renderItem={({ item }) => (
        <BookPreviewLinkRow book={item} replace={replace} />
      )}
    />
  );
}
