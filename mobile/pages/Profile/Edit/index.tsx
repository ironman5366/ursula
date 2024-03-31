import { Profile } from "@ursula/shared-types/derived.ts";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Button, Input, SizableText, TextArea, YStack } from "tamagui";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { FloatingActionBar } from "../../../components/containers/TabBar.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import { useUpdateProfile } from "../../../hooks/profile.ts";
import { Stack } from "expo-router";
import FollowersSection from "./FollowersSection.tsx";
import PickProfileImage from "../../../components/molecules/PickProfileImage.tsx";
import UsernameInput from "../../../components/molecules/UsernameInput.tsx";

interface Props {
  profile: Profile;
}

export default function EditProfilePage({ profile }: Props) {
  const { session } = useSession();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [name, setName] = useState(profile.full_name);

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  return (
    <YStack>
      <Stack.Screen
        options={{
          title: `User ${profile.username}`,
        }}
      />
      <SafeAreaView>
        <YStack height="100%" p="$3">
          <YStack gap="$3" alignItems="center" width="100%">
            <PickProfileImage profile={profile} />
            <FollowersSection profile={profile} />

            <SizableText>Username:</SizableText>
            {isOwnProfile ? (
              <UsernameInput username={username} setUsername={setUsername} />
            ) : (
              <StyledText>@{username}</StyledText>
            )}

            <SizableText>Name:</SizableText>

            <Input
              width="100%"
              value={name}
              onChangeText={setName}
              editable={isOwnProfile}
            />

            <SizableText>Bio:</SizableText>
            <TextArea
              value={bio}
              onChangeText={(val) => setBio(val)}
              editable={isOwnProfile}
              placeholder={"Your Bio"}
              numberOfLines={3}
            />
          </YStack>
        </YStack>
      </SafeAreaView>
      {isOwnProfile && (
        <FloatingActionBar>
          <Button
            width={300}
            unstyled
            alignSelf="center"
            height={50}
            px={10}
            onPress={() => {
              updateProfile({
                username,
                full_name: name,
                bio,
              });
            }}
            fontWeight="bold"
            color="white"
            flexDirection="row"
            alignItems="center"
            alignContent="space-around"
            justifyContent="space-around"
          >
            Save
          </Button>
        </FloatingActionBar>
      )}
    </YStack>
  );
}
