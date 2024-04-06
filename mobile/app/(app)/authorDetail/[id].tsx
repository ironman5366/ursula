import React from "react";
import useNumericIdParam from "../../../hooks/useIdParam.ts";
import { useAuthor } from "../../../hooks/authors.ts";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import AuthorPage from "../../../pages/Author";

export default function AuthorDetail() {
  const id = useNumericIdParam();
  const { data: author, isLoading } = useAuthor(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AuthorPage author={author} />;
}
