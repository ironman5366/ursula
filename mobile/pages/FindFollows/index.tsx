import React, { useEffect, useState } from "react";
import { SizableText, YStack } from "tamagui";
import { WILLS_USER_ID } from "../../constants.ts";
import { useBulkFollow } from "../../hooks/follows.ts";
import { router } from "expo-router";
import { MoveRight } from "@tamagui/lucide-icons";
import { SafeAreaView, StyleSheet } from "react-native";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import FollowProfileItem from "./FollowProfileItem.tsx";
import FollowProfileSearch from "./FollowProfileSearch.tsx";
import FloatingLinkButton from "../../components/atoms/FloatingLinkButton.tsx";

export default function FindFollowsPage() {
  const [follows, setFollows] = useState<string[]>([WILLS_USER_ID]);
  const followText = `Follow ${follows.length} ${
    follows.length === 1 ? "person" : "people"
  }`;
  const { mutate: doFollow, isLoading, isSuccess } = useBulkFollow();
  const finished = () => {
    router.replace("/(app)/(tabs)");
  };

  useEffect(() => {
    if (isSuccess) {
      finished();
    }
  }, [isSuccess]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SizableText>Find people to follow</SizableText>
      <YStack>
        {follows.map((f, i) => (
          <FollowProfileItem
            profileId={f}
            follows={follows}
            setFollows={setFollows}
            key={i}
          />
        ))}
      </YStack>
      <FollowProfileSearch follows={follows} setFollows={setFollows} />
      <FloatingLinkButton
        onPress={() => {
          if (follows.length > 0) {
            doFollow(follows);
          } else {
            finished();
          }
        }}
        iconAfter={<MoveRight size="$1" />}
      >
        {followText}
      </FloatingLinkButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 5,
    alignItems: "center",
  },
});
