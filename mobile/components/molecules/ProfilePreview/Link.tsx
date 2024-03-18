import { ComponentProps } from "react";
import ProfilePreviewRow from "./Row.tsx";
import { Link } from "expo-router";

interface Props extends ComponentProps<typeof ProfilePreviewRow> {
  replace?: boolean;
}

export default function ProfilePreviewLink({
  profile,
  replace,
  ...props
}: Props) {
  return (
    <Link href={`/profileDetail/${profile.id}`} asChild replace={replace}>
      <ProfilePreviewRow profile={profile} {...props} />
    </Link>
  );
}
