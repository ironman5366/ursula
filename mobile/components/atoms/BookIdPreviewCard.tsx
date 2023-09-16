import React from "react";
import useBook from "../../hooks/useBook";
import BookPreviewCard from "../molecules/BookPreviewCard";
import { ActivityIndicator } from "react-native";

export interface Props {
  bookId: number;
}

export default function BookIdPreviewCard({ bookId }: Props) {
  const { data: book } = useBook(bookId);

  // TODO: make this less ugly
  return book
    ? <BookPreviewCard book={book} />
    : <ActivityIndicator size={"small"} />;
}
