import React from "react";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import useBook from "../../../hooks/useBook.ts";
import useNumericIdParam from "../../../hooks/useIdParam.ts";
import BookDetailPage from "../../../pages/Book";

export default function BookDetail() {
  const id = useNumericIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return <LoadingScreen />;
  }

  return <BookDetailPage book={book} />;
}
