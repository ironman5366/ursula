import React from "react";
import {
  useFollow,
  useIsFollowing,
  useUnfollow,
} from "../../../hooks/follows.ts";
import { useSession } from "../../../contexts/SessionContext.ts";
import StyledButton from "../../../components/organisms/StyledButton.tsx";
import { ActivityIndicator } from "react-native";
import { Profile } from "@ursula/shared-types/derived.ts";

interface Props {
  profile: Profile;
}

export default function FollowButton({ profile }: Props) {
  const { session } = useSession();
  const { data: isFollowing } = useIsFollowing({
    follower_id: session.user.id,
    followee_id: profile.id,
  });
  const { mutate: follow } = useFollow();
  const { mutate: unfollow } = useUnfollow();

  if (typeof isFollowing !== "boolean") {
    return (
      <StyledButton disabled>
        <ActivityIndicator size={"small"} />
      </StyledButton>
    );
  }

  if (isFollowing) {
    return (
      <StyledButton onPress={() => unfollow(profile)} title={"Unfollow"} />
    );
  } else {
    return <StyledButton onPress={() => follow(profile)} title={"Follow"} />;
  }
}
