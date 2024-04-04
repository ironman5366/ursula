import { Stack } from "expo-router";
import React, { ComponentProps, useState } from "react";
import { YStack, Text, XStack } from "tamagui";
import RankingList from "../../../pages/RankingList";
import ReadingList from "../../../pages/ReadingList.tsx";
import { DefaultHeader } from "../../../components/atoms/DefaultHeader.tsx";
import SearchContainer from "../../../components/containers/SearchContainer";
import Tabs from "../../../components/organisms/Tabs.tsx";
import { StyledView } from "../../../components/organisms/StyledView.tsx";

export default function YourBooks() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Books",
          header: DefaultHeader,
        }}
      />
      <SearchContainer editable={false}>
        <StyledView
          style={{
            flex: 1,
          }}
        >
          <Tabs initial={"wantToRead"}>
            <XStack justifyContent="space-between">
              <Tabs.Button name="wantToRead" flexGrow={1}>
                <Text fontWeight={"600"}>Want to read</Text>
              </Tabs.Button>
              <Tabs.Button name={"alreadyRead"} flexGrow={1}>
                <Text fontWeight={"600"}>Already read</Text>
              </Tabs.Button>
            </XStack>

            <Tabs.Content name="wantToRead">
              <ReadingList />
            </Tabs.Content>

            <Tabs.Content name="alreadyRead">
              <RankingList />
            </Tabs.Content>
          </Tabs>
        </StyledView>
      </SearchContainer>
    </>
  );
}
