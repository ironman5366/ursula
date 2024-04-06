import React from "react";
import { Author } from "@ursula/shared-types/derived.ts";
import { Text, XStack, YStack } from "tamagui";
import { Stack } from "expo-router";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import AuthorBooks from "./AuthorBooks.tsx";
import { SafeAreaView, ScrollView } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";

interface Props {
  author: Author;
}

export default function AuthorPage({ author }: Props) {
  console.log("Rendering authorpage", author);
  return (
    <>
      <Stack.Screen
        options={{
          title: author.name,
          headerTransparent: true,
        }}
      />
      <SafeAreaView>
        <ScrollView>
          <YStack alignItems={"center"} gap={"$3"} m={"$3"}>
            <TitleText>{author.name}</TitleText>
            {author.bio && <Text>{author.bio}</Text>}
            <XStack gap={"$3"}>
              {author.birth_date && <Text>Born {author.birth_date}</Text>}
              {author.death_date && <Text>Died {author.death_date}</Text>}
            </XStack>
            <AuthorBooks authorId={author.id} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
