import React from "react";
import { FlatList, ScrollView } from "react-native";
import {
  SearchResult,
  SearchResultType,
} from "@ursula/shared-types/SearchResult.ts";
import { SizableText, YStack } from "tamagui";
import SearchResultItem from "./Item.tsx";

interface Props {
  results: SearchResult[];
}

type SectionMappings = {
  [T in SearchResultType]: {
    title: string;
    order: number;
  };
};

const MAPPINGS: SectionMappings = {
  profiles: {
    title: "Profiles",
    order: 1,
  },
  books: {
    title: "Books",
    order: 2,
  },
  authors: {
    title: "Authors",
    order: 3,
  },
};

const sortedKeys = Object.keys(MAPPINGS).sort(
  (a, b) => MAPPINGS[a].order - MAPPINGS[b].order
);

export default function SearchResultList({ results }: Props) {
  return (
    <ScrollView>
      <YStack>
        {results &&
          results.length > 0 &&
          sortedKeys.map((key) => {
            const { title } = MAPPINGS[key];
            const sectionResults = results
              .filter((result) => result.entity_type === key)
              .sort((a, b) => a.order_key - b.order_key);

            if (sectionResults.length > 0) {
              return (
                <FlatList
                  key={key}
                  data={sectionResults}
                  renderItem={({ item }) => <SearchResultItem result={item} />}
                  ListHeaderComponent={<SizableText>{title}</SizableText>}
                  scrollEnabled={false}
                />
              );
            }
          })}
      </YStack>
    </ScrollView>
  );
}
