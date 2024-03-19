import React from "react";
import { FlatList } from "react-native";
import { SearchResult } from "../../../../shared-types/SearchResult.ts";
import SearchResultItem from "./SearchResultItem.tsx";
import { YStack } from "tamagui";

interface Props {
  results: SearchResult[];
}

export default function SearchResultList({ results }: Props) {
  return (
    <YStack>
       <FlatList
      data={results}
      renderItem={({ item }) => <SearchResultItem result={item} />}
    />
    </YStack>
  );
}
