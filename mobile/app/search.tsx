import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import SearchContainer from "../components/containers/SearchContainer.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import useSearch from "../hooks/useSearch.ts";
import BookList from "../components/molecules/BookList.tsx";
import { Stack } from "expo-router";

export default function Search() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);

  const { data, isLoading } = useSearch({
    name: debounced,
    enabled: !!debounced,
  });

  const showLoading = isLoading && !!debounced;

  return (
    <SearchContainer
      editable
      onChangeText={(text) => setQuery(text)}
      value={query}
    >
      <Stack.Screen
        options={{
          title: "Search",
        }}
      />
      {showLoading ? (
        <ActivityIndicator />
      ) : (
        <BookList books={data} replace={true} />
      )}
    </SearchContainer>
  );
}
