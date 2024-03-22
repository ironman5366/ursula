import React from "react";
import {
  AuthorSearchResult,
  BookSearchResult,
  ProfileSearchResult,
  SearchResult,
} from "@ursula/shared-types/SearchResult.ts";
import LoaderRow from "../../components/atoms/LoaderRow.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import useBook from "../../hooks/useBook.ts";
import { useAuthor } from "../../hooks/authors.ts";
import { useProfile } from "../../hooks/profile.ts";
import BookPreviewLink from "../../components/molecules/BookPreview/Link.tsx";
import AuthorPreviewLink from "../../components/molecules/AuthorPreview/Link.tsx";
import ProfilePreviewLink from "../../components/molecules/ProfilePreview/Link.tsx";

interface Props {
  result: SearchResult;
}

function BookResultRow({ result }: { result: BookSearchResult }) {
  const { data: book } = useBook(result.entity_id_numeric);
  return (
    <LoaderRow
      icon={<Ionicons name={"book"} />}
      elem={book}
      render={(it) => <BookPreviewLink book={it} />}
    />
  );
}

function AuthorResultRow({ result }: { result: AuthorSearchResult }) {
  const { data: author } = useAuthor(result.entity_id_numeric);
  return (
    <LoaderRow
      icon={<Ionicons name={"pencil"} />}
      elem={author}
      render={(it) => <AuthorPreviewLink author={it} />}
    />
  );
}

function ProfileResultRow({ result }: { result: ProfileSearchResult }) {
  const { data: profile } = useProfile(result.entity_id_uuid);
  return (
    <LoaderRow
      icon={<Ionicons name={"person"} />}
      elem={profile}
      render={(it) => <ProfilePreviewLink profile={it} />}
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
