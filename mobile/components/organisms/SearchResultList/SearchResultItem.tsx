import React from "react";
import {
  AuthorSearchResult,
  BookSearchResult,
  SearchResult,
} from "../../../../shared-types/SearchResult.ts";
import BookPreviewLink from "../../atoms/BookPreviewLink.tsx";
import LoaderRow from "./LoaderRow.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import useBook from "../../../hooks/useBook.ts";
import BookPreviewRow from "../../molecules/BookPreviewRow.tsx";

interface Props {
  result: SearchResult;
}

function BookResultRow({ result }: { result: BookSearchResult }) {
  const { data: book } = useBook(result.entity_id_numeric);
  return (
    <LoaderRow
      icon={<Ionicons name={"book"} />}
      elem={book}
      render={(it) => <BookPreviewRow book={it} />}
    />
  );
}

function AuthorResultRow({ result }: { result: AuthorSearchResult }) {}

export default function SearchResultItem({ result }: Props) {
  switch (result.entity_type) {
    case "books":
      return <BookResultRow result={result} />;
  }
}
