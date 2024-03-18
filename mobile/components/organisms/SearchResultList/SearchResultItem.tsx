import React from "react";
import {
  AuthorSearchResult,
  BookSearchResult,
  ProfileSearchResult,
  SearchResult,
} from "../../../../shared-types/SearchResult.ts";
import LoaderRow from "./LoaderRow.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import useBook from "../../../hooks/useBook.ts";
import BookPreviewRow from "../../molecules/BookPreviewRow.tsx";
import { useAuthor } from "../../../hooks/authors.ts";
import AuthorPreviewRow from "../../molecules/AuthorPreviewRow.tsx";
import { useProfile } from "../../../hooks/profile.ts";
import ProfilePreviewRow from "../../molecules/ProfilePreviewRow.tsx";

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

function AuthorResultRow({ result }: { result: AuthorSearchResult }) {
  const { data: author } = useAuthor(result.entity_id_numeric);
  return (
    <LoaderRow
      icon={<Ionicons name={"pencil"} />}
      elem={author}
      render={(it) => <AuthorPreviewRow author={it} />}
    />
  );
}

function ProfileResultRow({ result }: { result: ProfileSearchResult }) {
  const { data: profile } = useProfile(result.entity_id_uuid);
  return (
    <LoaderRow
      icon={<Ionicons name={"person"} />}
      elem={profile}
      render={(it) => <ProfilePreviewRow profile={it} />}
    />
  );
}

export default function SearchResultItem({ result }: Props) {
  switch (result.entity_type) {
    case "books":
      return <BookResultRow result={result} />;
    case "authors":
      return <AuthorResultRow result={result} />;
    case "profiles":
      return <ProfileResultRow result={result} />;
  }
}
