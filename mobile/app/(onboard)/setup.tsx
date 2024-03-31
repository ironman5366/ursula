import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { H3, H5, H6, SizableText, YStack } from "tamagui";
import PickProfileImage from "../../components/molecules/PickProfileImage.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import FloatingLinkButton from "../../components/atoms/FloatingLinkButton.tsx";
import { MoveRight } from "@tamagui/lucide-icons";
import UsernameInput from "../../components/molecules/UsernameInput.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { TitleText } from "../../components/atoms/TitleText.tsx";

export default function SetupAccount() {
  const { data: profile } = useCurrentProfile();
  const [username, setUsername] = useState("");

  if (!profile) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TitleText>Setup your profile</TitleText>
      <YStack alignItems={"center"} gap={"$5"}>
        <H6>Pick a profile image (optional):</H6>
        <PickProfileImage profile={profile} />

        <H6>Pick a username:</H6>
        <UsernameInput username={username} setUsername={setUsername} />
      </YStack>
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
