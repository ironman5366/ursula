import React, {
  ComponentProps,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { Button, XStack, YStack } from "tamagui";
import FavoriteBooks from "../../../components/organisms/FavoriteBooks.tsx";
import UserActivities from "../../../components/molecules/UserActivities.tsx";

interface TabButtonProps extends ComponentProps<typeof Button> {
  value: string;
  currTab: string;
  setCurrTab: Dispatch<SetStateAction<string>>;
}

function ProfileTabButton({
  value,
  currTab,
  setCurrTab,
  ...props
}: TabButtonProps) {
  const active = currTab === value;
  return (
    <Button
      borderWidth={0}
      borderRadius={0}
      borderBottomWidth={active ? 1 : 0}
      borderColor={"$claret"}
      onPress={() => setCurrTab(value)}
      {...props}
    />
  );
}

interface Props {
  profile: Profile;
}

export default function ProfileTabs({ profile }: Props) {
  const [currTab, setCurrTab] = useState("favoriteBooks");

  return (
    <YStack style={{ height: "100%" }}>
      <XStack justifyContent="space-between">
        <ProfileTabButton
          value={"favoriteBooks"}
          setCurrTab={setCurrTab}
          currTab={currTab}
        >
          Favorite Books
        </ProfileTabButton>
        <ProfileTabButton
          value={"recentActivity"}
          setCurrTab={setCurrTab}
          currTab={currTab}
        >
          Recent Activity
        </ProfileTabButton>
      </XStack>
      {currTab === "favoriteBooks" ? (
        <FavoriteBooks profile={profile} />
      ) : (
        <UserActivities profile={profile} />
      )}
    </YStack>
  );
}
