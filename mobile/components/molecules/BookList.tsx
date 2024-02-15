import React from "react";
import { FlatList } from "react-native";
import BookPreviewRow from "./BookPreviewRow.tsx";
import { Book } from "../../../shared-types/derived";

interface Props {
  books: Book[];
}

export default function BookList({ books }: Props) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookPreviewRow book={item} />}
    />
  );
}
