import { Profile } from "@ursula/shared-types/derived.ts";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Button, Input, TextArea, YStack } from "tamagui";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { FloatingActionBar } from "../../../components/containers/TabBar.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import { useUpdateProfile } from "../../../hooks/profile.ts";
import { Stack } from "expo-router";
import FollowersSection from "./FollowersSection.tsx";

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
            <FollowersSection profile={profile} />

            {isOwnProfile ? (
              <Input
                autoCorrect={false}
                autoComplete={"off"}
                autoCapitalize={"none"}
                width="100%"
                value={username}
                onChangeText={setUsername}
                editable={isOwnProfile}
              />
            ) : (
              <StyledText>@{username}</StyledText>
            )}

            <TextArea
              value={bio}
              onChangeText={(val) => setBio(val)}
              editable={isOwnProfile}
              placeholder={"Your Bio"}
              numberOfLines={3}
            />

            <Input
              width="100%"
              value={name}
              onChangeText={setName}
              editable={isOwnProfile}
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
