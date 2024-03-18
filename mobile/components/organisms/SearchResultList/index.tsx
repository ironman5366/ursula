import React from "react";
import { FlatList } from "react-native";
import { SearchResult } from "../../../../shared-types/SearchResult.ts";
import SearchResultItem from "./SearchResultItem.tsx";

interface Props {
  results: SearchResult[];
}

export default function SearchResultList({ results }: Props) {
  return (
    <FlatList
      data={results}
      renderItem={({ item }) => <SearchResultItem result={item} />}
    />
  );
}
