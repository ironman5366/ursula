import React from "react";
import { SafeAreaView } from "react-native";
import { SizableText, YStack } from "tamagui";
import PickProfileImage from "../../components/molecules/PickProfileImage.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import FloatingLinkButton from "../../components/atoms/FloatingLinkButton.tsx";
import { MoveRight } from "@tamagui/lucide-icons";

export default function SetupAccount() {
  const { data: profile } = useCurrentProfile();

  if (!profile) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView>
      <YStack>
        <PickProfileImage profile={profile} />
        <YStack>
          <SizableText>Pick a username:</SizableText>
        </YStack>
      </YStack>
      <FloatingLinkButton href={"/"} iconAfter={<MoveRight size="$1" />}>
        Finish
      </FloatingLinkButton>
    </SafeAreaView>
  );
}
