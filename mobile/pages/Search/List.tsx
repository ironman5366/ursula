import React, { ReactElement } from "react";
import { FlatList, ScrollView } from "react-native";
import {
  SearchResult,
  SearchResultType,
} from "@ursula/shared-types/SearchResult.ts";
import { SizableText, YStack } from "tamagui";
import SearchResultItem from "./Item.tsx";

interface Props {
  results: SearchResult[];
  allowedTypes?: SearchResultType[];
  renderSearchItem?: (result: SearchResult) => ReactElement;
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

export default function SearchResultList({
  results,
  allowedTypes,
  renderSearchItem,
}: Props) {
  const filteredResults = results.filter((result) => {
    if (allowedTypes && allowedTypes.length > 0) {
      return allowedTypes.includes(result.entity_type);
    } else {
      return true;
    }
  });
  return (
    <ScrollView>
      <YStack>
        {filteredResults &&
          filteredResults.length > 0 &&
          sortedKeys.map((key) => {
            const { title } = MAPPINGS[key];
            const sectionResults = filteredResults
              .filter((result) => result.entity_type === key)
              .sort((a, b) => b.order_key - a.order_key);

            if (sectionResults.length > 0) {
              return (
                <FlatList
                  key={key}
                  data={sectionResults}
                  renderItem={({ item }) => {
                    if (renderSearchItem) {
                      return renderSearchItem(item);
                    }
                    return <SearchResultItem result={item} />;
                  }}
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
