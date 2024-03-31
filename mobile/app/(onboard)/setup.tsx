import React, { useState } from "react";
import { SafeAreaView, TextInput } from "react-native";
import { SizableText, YStack } from "tamagui";
import PickProfileImage from "../../components/molecules/PickProfileImage.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import FloatingLinkButton from "../../components/atoms/FloatingLinkButton.tsx";
import { MoveRight } from "@tamagui/lucide-icons";
import UsernameInput from "../../components/molecules/UsernameInput.tsx";

export default function SetupAccount() {
  const { data: profile } = useCurrentProfile();
  const [username, setUsername] = useState("");

  if (!profile) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView>
      <YStack>
        <PickProfileImage profile={profile} />
        <YStack>
          <SizableText>Pick a username:</SizableText>
          <UsernameInput username={username} setUsername={setUsername} />
        </YStack>
      </YStack>
      <FloatingLinkButton href={"/"} iconAfter={<MoveRight size="$1" />}>
        Finish
      </FloatingLinkButton>
    </SafeAreaView>
  );
}
