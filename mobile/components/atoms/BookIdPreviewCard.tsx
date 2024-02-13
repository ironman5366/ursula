import React from "react";
import useBook from "../../hooks/useBook";
import BookPreviewCard, {
  BookPreviewCardProps,
} from "../molecules/BookPreviewCard";
import { ActivityIndicator } from "react-native";

export interface Props extends Omit<BookPreviewCardProps, "book"> {
  bookId: number;
}

export default function BookIdPreviewCard({ bookId, ...rest }: Props) {
  const { data: book } = useBook(bookId);

  // TODO: make this less ugly
  return book ? (
    <BookPreviewCard book={book} {...rest} />
  ) : (
    <ActivityIndicator size={"small"} />
  );
}
