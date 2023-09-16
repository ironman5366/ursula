import React from "react";
import { FlatList } from "react-native";
import BookPreviewCard from "./BookPreviewCard";
import { Book } from "../../types/derived";

export interface SearchResultListProps {
  books: Book[];
}

export default function SearchResultList({ books }: SearchResultListProps) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookPreviewCard book={item} />}
    />
  );
}
