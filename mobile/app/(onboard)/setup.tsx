import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Input, Text, YStack } from "tamagui";
import PickProfileImage from "../../components/molecules/PickProfileImage.tsx";
import { useCurrentProfile, useUpdateProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { MoveRight } from "@tamagui/lucide-icons";
import UsernameInput from "../../components/molecules/UsernameInput.tsx";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import { router } from "expo-router";
import FloatingButton from "../../components/organisms/FloatingActionBar/FloatingButton.tsx";
import FloatingActionBar from "../../components/organisms/FloatingActionBar";

export default function SetupAccount() {
  const { data: profile } = useCurrentProfile();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { mutate: updateProfile, isSuccess, isLoading } = useUpdateProfile();

  useEffect(() => {
    if (isSuccess) {
      console.log("Sending to follows");
      router.replace("/(onboard)/follows");
    }
  }, [isSuccess]);

  useEffect(() => {
    // We might be here from an initialized profile that just needs to setup.
    // If so, populate accordingly
    if (profile) {
      if (!username) {
        let initialUsername;
        if (profile.username.includes("@")) {
          initialUsername = profile.username.split("@")[0];
        } else {
          initialUsername = profile.username;
        }
        setUsername(initialUsername);
      }

      if (!name) {
        if (profile.full_name && !profile.full_name.includes("New Name")) {
          setName(profile.full_name);
        }
      }
    }
  }, [profile]);

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TitleText>Setup Your Profile</TitleText>
      <YStack alignItems={"center"} gap={"$8"} marginTop={"$5"}>
        <YStack alignItems="center">
          <PickProfileImage profile={profile} />
        </YStack>

        <YStack alignItems="center">
          <Text fontWeight="bold" fontSize={"$5"}>
            Username:
          </Text>
          <UsernameInput username={username} setUsername={setUsername} />
        </YStack>

        <YStack alignItems="center">
          <Text fontWeight="bold" fontSize={"$5"}>
            Name:
          </Text>
          <Input
            value={name}
            onChangeText={(val) => setName(val)}
            placeholder={"Jane Austen"}
            placeholderTextColor={"gray"}
          />
        </YStack>
      </YStack>
      <FloatingActionBar>
        <FloatingButton
          onPress={() => updateProfile({ username, full_name: name })}
          iconAfter={<MoveRight size="$1" />}
        >
          Save and Find Friends
        </FloatingButton>
      </FloatingActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
});
