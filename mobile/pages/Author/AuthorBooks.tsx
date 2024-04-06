import React from "react";
import { useAuthorBooks } from "../../hooks/authors.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import BookList from "../../components/molecules/BookList.tsx";
import { Text } from "tamagui";

interface Props {
  authorId: number;
}

export default function AuthorBooks({ authorId }: Props) {
  console.log("authorId", authorId);
  const { data: books, isLoading } = useAuthorBooks(authorId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (Array.isArray(books) && books.length === 0) {
    return <Text>No books found.</Text>;
  }

  return <BookList books={books} />;
}
