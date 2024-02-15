import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import SearchContainer from "../components/SearchContainer";
import useDebounce from "../hooks/useDebounce.ts";
import useSearchBooks from "../hooks/useSearchBooks.ts";
import BookList from "../components/molecules/BookList.tsx";

export default function Search() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);

  const { data, isLoading } = useSearchBooks({
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
      {showLoading ? <ActivityIndicator /> : <BookList books={data} />}
    </SearchContainer>
  );
}
