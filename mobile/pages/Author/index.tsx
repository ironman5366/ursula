import React from "react";
import { Author } from "@ursula/shared-types/derived.ts";
import { Text, YStack } from "tamagui";
import { Stack } from "expo-router";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import AuthorBooks from "./AuthorBooks.tsx";
import { SafeAreaView } from "react-native";

interface Props {
  author: Author;
}

export default function AuthorPage({ author }: Props) {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: author.name,
          headerTransparent: true,
        }}
      />
      <YStack style={{ flex: 1 }} alignItems={"center"} gap={"$3"}>
        <TitleText>{author.name}</TitleText>
        {author.bio && <Text>{author.bio}</Text>}
        <AuthorBooks authorId={author.id} />
      </YStack>
    </SafeAreaView>
  );
}
