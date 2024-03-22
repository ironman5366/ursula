import React, { ComponentProps } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useFollowers, useFollowing } from "../../../hooks/follows.ts";
import { StyledView } from "../../../components/organisms/StyledView.tsx";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Link, LinkProps } from "expo-router";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import StyledButton from "../../../components/organisms/StyledButton.tsx";
import FollowButton from "./FollowButton.tsx";
import { XStack } from "tamagui";

interface FollowerLinkProps<T> extends Omit<LinkProps<T>, "children"> {
  list: string[] | undefined;
  link_text: string;
}

function FollowerLink<T>({ list, href, link_text }: FollowerLinkProps<T>) {
  if (list === undefined) {
    return (
      <>
        <ActivityIndicator size={"small"} />
        <StyledText>{link_text}</StyledText>
      </>
    );
  } else {
    return (
      <Link href={href}>
        <StyledText>
          {list.length} {link_text}
        </StyledText>
      </Link>
    );
  }
}

interface Props {
  profile: Profile;
}

export default function FollowersSection({ profile }: Props) {
  const { session } = useSession();
  const { data: followers } = useFollowers(profile.id);
  const { data: following } = useFollowing(profile.id);

  const isOwnProfile = profile.id == session.user.id;

  return (
    <XStack alignItems="center" justifyContent="center" gap="$3">
      <FollowerLink
        list={followers}
        link_text={"Followers"}
        href={`/followers/${profile.id}`}
      />
      <FollowerLink
        list={following}
        link_text={"Following"}
        href={`/following/${profile.id}`}
      />
      {!isOwnProfile && (
        <StyledView>
          <FollowButton userId={profile.id} />
        </StyledView>
      )}
    </XStack>
  );
}
