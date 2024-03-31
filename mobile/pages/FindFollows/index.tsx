import React, { useEffect, useState } from "react";
import { Button, SizableText, XStack, YStack } from "tamagui";
import { WILLS_USER_ID } from "../../constants.ts";
import { useBulkFollow } from "../../hooks/follows.ts";
import useDebounce from "../../hooks/useDebounce.ts";
import { Link, router } from "expo-router";
import { MoveRight } from "@tamagui/lucide-icons";
import { FloatingActionBar } from "../../components/containers/TabBar.tsx";
import SearchPage from "../Search";
import { FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import FollowProfileItem from "./FollowProfileItem.tsx";
import FollowProfileSearch from "./FollowProfileSearch.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";

export default function FindFollowsPage() {
  const [follows, setFollows] = useState<string[]>([WILLS_USER_ID]);
  const followText = `Follow ${follows.length} ${
    follows.length === 1 ? "person" : "people"
  }`;
  const { mutate: doFollow, isLoading, isSuccess } = useBulkFollow();
  const finished = () => {
    router.replace("/(app)/(tabs)");
  };
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useDebounce(
    searchInput,
    500
  );

  useEffect(() => {
    if (isSuccess) {
      finished();
    }
  }, [isSuccess]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("Current find follows is ", follows);

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
      <FloatingActionBar>
        <Link href="/" asChild>
          <Button
            width={300}
            unstyled
            alignSelf="center"
            height={50}
            px={10}
            fontWeight="bold"
            color="white"
            href="/(onboard)/signup"
            flexDirection="row"
            alignItems="center"
            alignContent="space-between"
            justifyContent="space-between"
            iconAfter={<MoveRight size="$1" />}
            onPress={() => {
              if (follows.length > 0) {
                doFollow(follows);
              } else {
                finished();
              }
            }}
          >
            {followText}
          </Button>
        </Link>
      </FloatingActionBar>
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
