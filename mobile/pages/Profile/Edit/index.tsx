import { Profile } from "@ursula/shared-types/derived.ts";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Button, Input, YStack } from "tamagui";
import LoadingScreen from "../../../components/atoms/LoadingScreen.tsx";
import ProfileImage from "../../../components/atoms/ProfileImage.tsx";
import { StyledText } from "../../../components/atoms/StyledText.tsx";
import { FloatingActionBar } from "../../../components/containers/TabBar.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import { useUpdateProfile } from "../../../hooks/profile.ts";
import { supabase } from "../../../utils/supabase.ts";
import { Stack } from "expo-router";
import FollowersSection from "./FollowersSection.tsx";

interface Props {
  profile: Profile;
}

export default function EditProfilePage({ profile }: Props) {
  const { session } = useSession();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.full_name);

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      const { base64: encoded, uri } = result.assets[0];

      // Upload the result to supabase
      const ext = uri.substring(uri.lastIndexOf(".") + 1);
      const uploadPath = `${profile.id}/profile.${ext}`;

      console.log("Uploading", uri, "to", uploadPath);

      // Read the file and upload it

      // Upload with override
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(uploadPath, decode(encoded), {
          upsert: true,
          contentType: `image/${ext}`,
        });

      if (error) {
        console.error("Error uploading avatar", error);
        return;
      }

      updateProfile({
        avatar_key: data.path,
      });
    }
  };

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
            <YStack my="$5">
              <TouchableOpacity
                disabled={!isOwnProfile}
                onPress={() => {
                  if (isOwnProfile) {
                    pickProfileImage();
                  }
                }}
              >
                <ProfileImage profile={profile} size={100} />
              </TouchableOpacity>
            </YStack>
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
