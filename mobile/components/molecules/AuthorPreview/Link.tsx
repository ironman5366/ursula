import React, { ComponentProps } from "react";
import { Link } from "expo-router";
import AuthorPreviewRow from "./Row.tsx";

interface Props extends ComponentProps<typeof AuthorPreviewRow> {
  replace?: boolean;
}

export default function AuthorPreviewLink({
  author,
  replace,
  ...props
}: Props) {
  return (
    <Link href={`/authorDetail/${author.id}`} asChild replace={replace}>
      <AuthorPreviewRow author={author} {...props} />
    </Link>
  );
}
