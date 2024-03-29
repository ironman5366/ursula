import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, SizableText, Text, YStack } from "tamagui";
import SearchPage from "../../pages/Search";
import { WILLS_USER_ID } from "../../constants.ts";
import { useProfile } from "../../hooks/profile.ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoaderRow from "../../components/atoms/loaders/LoaderRow.tsx";
import ProfilePreviewRow from "../../components/molecules/ProfilePreview/Row.tsx";
import { FloatingActionBar } from "../../components/containers/TabBar.tsx";
import { Link, router } from "expo-router";
import { MoveRight } from "@tamagui/lucide-icons";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { useBulkFollow } from "../../hooks/follows.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";

interface FollowProfileItemProps {
  profileId: string;
  follows: string[];
  setFollows: Dispatch<SetStateAction<string[]>>;
}

export function FollowProfileItem({
  profileId,
  follows,
  setFollows,
}: FollowProfileItemProps) {
  const { data: profile } = useProfile(profileId);
  const isFollowing = follows.includes(profileId);

  return (
    <LoaderRow
      icon={<Ionicons name={"person"} />}
      elem={profile}
      render={(it) => (
        <ProfilePreviewRow profile={it}>
          <Text>@{it.username}</Text>
          <Ionicons
            name={isFollowing ? "checkmark" : "add"}
            onPress={() => {
              if (isFollowing) {
                setFollows(follows.filter((id) => id !== profileId));
              } else {
                setFollows([...follows, profileId]);
              }
            }}
          />
        </ProfilePreviewRow>
      )}
    />
  );
}

export default function FindFollows() {
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
      <StyledView
        style={{
          flex: 0.2,
        }}
      >
        <FlatList
          data={follows}
          renderItem={({ item }) => (
            <FollowProfileItem
              profileId={item}
              key={item}
              follows={follows}
              setFollows={setFollows}
            />
          )}
        />
      </StyledView>

      <SearchPage
        allowedTypes={["profiles"]}
        renderSearchItem={(it) => {
          return (
            <FollowProfileItem
              profileId={it.entity_id_uuid}
              follows={follows}
              setFollows={setFollows}
              key={it.entity_id_uuid}
            />
          );
        }}
      />
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
