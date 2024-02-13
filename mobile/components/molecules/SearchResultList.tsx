import React from "react";
import { FlatList } from "react-native";
import BookPreviewRow from "./BookPreviewRow.tsx";
import { Book } from "../../../shared-types/derived";

export interface SearchResultListProps {
  books: Book[];
}

export default function SearchResultList({ books }: SearchResultListProps) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookPreviewRow book={item} />}
    />
  );
}
